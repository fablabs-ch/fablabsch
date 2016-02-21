import pprint
import re
from datetime import datetime
import xml.etree.ElementTree as ET

from django.core.mail import send_mail
from django.http import HttpResponse
import requests
from rest_framework.pagination import LimitOffsetPagination

from .settings import FACEBOOK_ACCESS_TOKEN, TWITTER_BEARER_TOKEN
from .serializers import *

from rest_framework import viewsets
from rest_framework import permissions


def facebook_feed_import(space):
    if not space.facebook:
        return

    graph = requests.get('https://graph.facebook.com/%s/posts?limit=100&fields=created_time,caption,description,link,message,name,full_picture,type,source,attachments{subattachments}&access_token=%s' % (space.facebook, FACEBOOK_ACCESS_TOKEN)).json()
    for fb_post in graph['data']:
        if not Post.objects.filter(source_type=Post.FACEBOOK, source_id=fb_post['id']).exists():
            post = Post()
            post.space = space
            post.source_type = Post.FACEBOOK
            post.source_id = fb_post['id']
            post.created_at = datetime.strptime(fb_post['created_time'],'%Y-%m-%dT%H:%M:%S+0000')

            if fb_post['type'] == 'photo':
                post.type = Post.PHOTO
                if 'message' in fb_post:
                    post.message = fb_post['message']
                post.link = fb_post['link']
                post.save()
                if 'attachments' in fb_post:
                    for d in fb_post['attachments']['data']:
                        for m in d['subattachments']['data']:
                            if m['type'] == 'photo':
                                pi = PostImage()
                                pi.src = m['media']['image']['src']
                                pi.width = m['media']['image']['width']
                                pi.height = m['media']['image']['height']
                                if 'description' in m:
                                    pi.title = m['description']
                                if 'url' in m:
                                    pi.link = m['url']
                                pi.post = post
                                pi.save()
                elif 'full_picture' in fb_post:
                    pi = PostImage()
                    pi.src = fb_post['full_picture']
                    pi.post = post
                    pi.save()

            if fb_post['type'] == 'link' or fb_post['type'] == 'event':
                post.message = "%s\n\n" % fb_post['name']
                if 'description' in fb_post:
                    post.message += fb_post['description']
                post.type = Post.LINK
                post.link = fb_post['link']
                if fb_post['type'] == 'event':
                    post.type = Post.EVENT
                    #link contains event do something

                post.save()
                if 'full_picture' in fb_post:
                    pi = PostImage()
                    pi.src = fb_post['full_picture']
                    pi.post = post
                    pi.save()

            if fb_post['type'] == 'status':
                post.type = Post.STATUS
                post.message = fb_post['message']
                post.save()

            if fb_post['type'] == 'video':
                post.type = Post.VIDEO
                post.link = fb_post['source']
                post.message = ""
                if 'name' in fb_post:
                    post.message = "%s\n\n" % fb_post['name']
                if 'message' in fb_post:
                    post.message += fb_post['message']
                if 'description' in fb_post:
                    post.message += fb_post['description']
                post.save()
                if 'full_picture' in fb_post:
                    pi = PostImage()
                    pi.src = fb_post['full_picture']
                    pi.post = post
                    pi.save()


def twitter_feed_import(space):
    if not space.twitter:
        return

    twitter = requests.get('https://api.twitter.com/1.1/statuses/user_timeline.json?count=200&screen_name=%s&trim_user=true' % space.twitter,
                           headers={'Authorization': 'Bearer %s' % TWITTER_BEARER_TOKEN}).json()
    for tweet in twitter:
        if not Post.objects.filter(source_type=Post.TWITTER, source_id=tweet['id_str']).exists():
            #TODO handle retweet?
            #TODO handle hashtags and @mentions
            post = Post()
            post.space = space
            post.source_type = Post.TWITTER
            post.source_id = tweet['id_str']
            post.created_at = datetime.strptime(tweet['created_at'],'%a %b %d %H:%M:%S +0000 %Y')
            message = tweet['text']
            if 'entities' in tweet and 'urls' in tweet['entities']:
                for url in tweet['entities']['urls']:
                    message = message.replace(url['url'], '<a href="%s">%s</a>' % (url['expanded_url'], url['display_url']))
            post.message = message
            post.type = Post.STATUS
            post.save()
            if 'extended_entities' in tweet and 'media' in tweet['extended_entities']:
                for media in tweet['extended_entities']['media']:
                    if media['type'] == 'photo':
                        image = PostImage()
                        image.src = media['media_url']
                        image.post = post
                        image.save()
                        post.type = Post.PHOTO

            post.save()


def facebook_page_import(request, facebook_id):
    graph = requests.get('https://graph.facebook.com/%s/?fields=about,name,contact_address,description_html,description,location,start_info,emails,website&access_token=%s' % (facebook_id, FACEBOOK_ACCESS_TOKEN)).json()
    values = {
        'slug': facebook_id
    }
    if 'name' in graph:
        values['name'] = graph['name']
    if 'description_html' in graph:
        values['description'] = graph['description_html']
    elif 'description' in graph:
        values['description'] = graph['description']
    elif 'about' in graph:
        values['description'] = graph['about']
    if 'location' in graph:
        values['city'] = graph['location']['city']
        if 'latitude' in graph['location']:
            values['latitude'] = graph['location']['latitude']
            values['longitude'] = graph['location']['longitude']
        values['street'] = graph['location']['street']
        if 'zip' in graph['location']:
            values['zip'] = graph['location']['zip']
    if 'emails' in graph:
        values['email'] = graph['emails'][0]
    if 'website' in graph:
        values['website'] = graph['website']

    Space.objects.update_or_create(facebook=facebook_id, defaults=values)
    return HttpResponse('done')


def cron_import(request):
    for space in Space.objects.filter(show=True):
        try:
            facebook_feed_import(space)
        except Exception as e:
            print(e)
        try:
            twitter_feed_import(space)
        except Exception as e:
            print(e)

    return HttpResponse('done')
    #compare likes?


def cron_fablabsio(request):
    json = requests.get('https://api.fablabs.io/v0/labs.json').json()
    newlabs = []
    for lab in json['labs']:
        if lab['country_code'] == 'ch':
            space = Space.objects.filter(custom_data__fablabsio=lab['id']).first()
            if space is None:
                newlabs.append(lab)
    if len(newlabs) > 0:
        send_mail('[Fablabs.ch] new fablabs.io found', pprint.pformat(newlabs), 'no-reply@fablabs.ch',
                  ['boris.fritscher@fablab-lacote.ch'])

    return HttpResponse()


def cron_fablabis(request):
    json = requests.get('http://wiki.fablab.is/api.php?action=parse&pageid=3238&format=json').json()
    m = re.search(r'(<table width="1045" border="1" class="wikitable sortable">.*?</table>)',
                 json['parse']['text']['*'], flags=re.DOTALL)

    root = ET.fromstring(m.group(0))

    #Continent,Country,City,Name,Websites
    newlabs = []
    for tr in root.findall('tr'):
        row = [ET.tostring(td, method="text", encoding="utf-8").strip().decode("ascii", "ignore") for td in list(tr)]
        if row[1] == 'Switzerland':
            space = Space.objects.filter(custom_data__fablabis=row[3]).first()
            if space is None:
                newlabs.append(row)

    if len(newlabs) > 0:
        send_mail('[Fablabs.ch] new fablab.is found', pprint.pformat(newlabs), 'no-reply@fablabs.ch',
                  ['boris.fritscher@fablab-lacote.ch'])

    return HttpResponse()

#API

class SpaceViewSet(viewsets.ModelViewSet):
    # TODO object based permissions
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    queryset = Space.objects.filter(show=True).all()
    serializer_class = SpaceSerializer


class ResourcesViewSet(viewsets.ModelViewSet):
    # TODO object based permissions
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    queryset = Resource.objects.all()
    serializer_class = ResourceUpSerializer


class PostViewSet(viewsets.ModelViewSet):
    # TODO object based permissions
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    queryset = Post.objects.filter(show=True).order_by('-created_at').all()
    serializer_class = PostSerializer
    pagination_class = LimitOffsetPagination