# -*- coding: utf-8 -*-

# FabLabs-CH a community web site for swiss fablabs
# Copyright (C) 2016  Boris Fritscher

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

from rest_framework import filters
from icalendar import Calendar
from django.db import transaction
from rest_framework import permissions
from rest_framework import viewsets
from .serializers import *
from .settings import FACEBOOK_ACCESS_TOKEN, TWITTER_BEARER_TOKEN
from rest_framework.pagination import LimitOffsetPagination
import requests
from django.http import HttpResponse, HttpResponseNotFound
from django.core.mail import send_mail
from django.core.exceptions import ObjectDoesNotExist
import xml.etree.ElementTree as ET
from datetime import datetime, date
from PIL import Image
from pathlib import Path
import pprint
import re
from ruamel.yaml import YAML
from ruamel.yaml.representer import RoundTripRepresenter
from django_filters import rest_framework as filters
from django.utils.text import slugify

def repr_str(dumper: RoundTripRepresenter, data: str):
    if '\n' in data:
        return dumper.represent_scalar('tag:yaml.org,2002:str', data, style='|')
    return dumper.represent_scalar('tag:yaml.org,2002:str', data)


yaml = YAML()
yaml.representer.add_representer(str, repr_str)


def handle_facebook_post(space, fb_post, filter):
    if not Post.objects.filter(source_type=Post.FACEBOOK, source_id=fb_post['id']).exists():
        post = Post()
        post.space = space
        post.source_type = Post.FACEBOOK
        post.source_id = fb_post['id']
        post.created_at = datetime.strptime(
            fb_post['created_time'], '%Y-%m-%dT%H:%M:%S+0000')

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
                # link contains event do something

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

        if filter and not filter.search(post.message):
            post.delete()


def facebook_feed_import(space):
    if not space.facebook:
        return

    filter = None
    try:
        if space.custom_data and 'facebook_filter' in space.custom_data:
            filter = re.compile(space.custom_data['facebook_filter'])
    except Exception as e:
        print('REGEX_ERROR', e)

    graph = requests.get('https://graph.facebook.com/%s/posts?limit=100&fields=created_time,caption,description,link,message,name,full_picture,type,source,attachments{subattachments}&access_token=%s' % (
        space.facebook, FACEBOOK_ACCESS_TOKEN)).json()
    for fb_post in graph['data']:
        try:
            handle_facebook_post(space, fb_post, filter)
        except Exception as e:
            print(e)


def handle_twitter_post(space, tweet, filter):
    if not Post.objects.filter(source_type=Post.TWITTER, source_id=tweet['id_str']).exists():
        if filter is None or filter.search(tweet['text']):
            # TODO handle retweet?
            # TODO handle hashtags and @mentions
            post = Post()
            post.space = space
            post.source_type = Post.TWITTER
            post.source_id = tweet['id_str']
            post.created_at = datetime.strptime(
                tweet['created_at'], '%a %b %d %H:%M:%S +0000 %Y')
            message = tweet['text']
            if 'entities' in tweet and 'urls' in tweet['entities']:
                for url in tweet['entities']['urls']:
                    message = message.replace(
                        url['url'], '<a href="%s">%s</a>' % (url['expanded_url'], url['display_url']))
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


def twitter_feed_import(space):
    if not space.twitter:
        return

    filter = None
    try:
        if space.custom_data and 'twitter_filter' in space.custom_data:
            filter = re.compile(space.custom_data['twitter_filter'])
    except Exception as e:
        print('REGEX_ERROR', e)

    twitter = requests.get('https://api.twitter.com/1.1/statuses/user_timeline.json?count=200&screen_name=%s&trim_user=true' % space.twitter,
                           headers={'Authorization': 'Bearer %s' % TWITTER_BEARER_TOKEN}).json()
    for tweet in twitter:
        try:
            handle_twitter_post(space, tweet, filter)
        except Exception as e:
            print(e)


def facebook_page_import(request, facebook_id):
    graph = requests.get('https://graph.facebook.com/%s/?fields=about,name,contact_address,description_html,description,location,start_info,emails,website&access_token=%s' %
                         (facebook_id, FACEBOOK_ACCESS_TOKEN)).json()
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


@transaction.non_atomic_requests
def cron_import(request):
    for space in Space.objects.filter(show=True):
        # TODO: handle errors
        try:
            facebook_feed_import(space)
        except Exception as e:
            print(e)
        try:
            twitter_feed_import(space)
        except Exception as e:
            print(e)
    return HttpResponse('done')
    # compare likes?


def cron_fablabsio(request):
    json = requests.get('https://api.fablabs.io/v0/labs.json').json()
    newlabs = []
    for lab in json['labs']:
        if lab['country_code'] == 'ch':
            space = Space.objects.filter(
                custom_data__fablabsio=lab['id']).first()
            if space is None:
                newlabs.append(lab)
    if len(newlabs) > 0:
        send_mail('[Fablabs.ch] new fablabs.io found', pprint.pformat(newlabs), 'no-reply@fablabs.ch',
                  ['boris.fritscher@fablab-lacote.ch'])

    return HttpResponse()


def cron_fablabis(request):
    json = requests.get(
        'http://wiki.fablab.is/api.php?action=parse&pageid=3238&format=json').json()
    m = re.search(r'(<table width="1045" border="1" class="wikitable sortable">.*?</table>)',
                  json['parse']['text']['*'], flags=re.DOTALL)

    root = ET.fromstring(m.group(0))

    # Continent,Country,City,Name,Websites
    newlabs = []
    for tr in root.findall('tr'):
        row = [ET.tostring(
            td, method="text", encoding="utf-8").strip().decode("ascii", "ignore") for td in list(tr)]
        if row[1] == 'Switzerland':
            space = Space.objects.filter(custom_data__fablabis=row[3]).first()
            if space is None:
                newlabs.append(row)

    if len(newlabs) > 0:
        send_mail('[Fablabs.ch] new fablab.is found', pprint.pformat(newlabs), 'no-reply@fablabs.ch',
                  ['boris.fritscher@fablab-lacote.ch'])

    return HttpResponse()


@transaction.non_atomic_requests
def ical_import(request):
    for space in Space.objects.filter(events_ics__startswith="http").all():
        filter = None
        try:
            if space.custom_data and 'events_ics_filter' in space.custom_data:
                filter = re.compile(space.custom_data['events_ics_filter'])
        except Exception as e:
            print('REGEX_ERROR', e)

        try:
            gcal = Calendar.from_ical(requests.get(space.events_ics).text)
            for component in gcal.walk():
                if component.name == 'VEVENT' and (filter is None or (component.get('DESCRIPTION') is not None and
                                                                      filter.search(component.get('DESCRIPTION')))):
                    e = Event()
                    e.space = space
                    e.uid = component.get('UID')
                    e.startdate = component.get('DTSTART').dt
                    e.enddate = component.get('DTEND').dt
                    e.summary = component.get('SUMMARY')
                    e.description = component.get('DESCRIPTION')
                    # can be null
                    if component.get('LAST-MODIFIED'):
                        e.modified = component.get('LAST-MODIFIED').dt
                    else:
                        e.modified = component.get('DTSTAMP').dt
                    e.location = component.get('LOCATION')
                    # can be single or list
                    attach = component.get('ATTACH')
                    if attach:
                        if not isinstance(component.get('attach'), str):
                            # for now only handle first attachment
                            attach = attach[0]
                        # fix drive links
                        m = re.search(r'drive.google.*/(.*)/view', attach)
                        if m:
                            attach = 'https://drive.google.com/uc?export=download&id=%s' % m.group(
                                1)
                        e.image_src = attach
                    e.save()
                    # link, categorie LAST-MODIFIED else DTSTAMP
                    # Location
                    # URL
        except Exception as e:
            print(e)

    return HttpResponse()


def pages(request, page_slug):
    try:
        page = Page.objects.get(slug=page_slug)
        return HttpResponse(page.content)
    except ObjectDoesNotExist:
        return HttpResponseNotFound()


def export_machines(request):
    resources = Resource.objects.all()
    for resource in resources:
        r_data = {
            'name': resource.model,
        }
        if resource.custom_data:
            for key in resource.custom_data.keys():
                r_data[key] = resource.custom_data[key]
        folder = 'content/machines'
        Path("%s/%s/%s" % (folder, resource.type, resource.vendor.name)
             ).mkdir(parents=True, exist_ok=True)
        filename = resource.model
        try:
            streamFile = open("%s/%s/%s/%s.yml" %
                            (folder, resource.type, resource.vendor.name, filename), 'w')
        except:
            filename = slugify(resource.model)
            streamFile = open("%s/%s/%s/%s.yml" %
                            (folder, resource.type, resource.vendor.name, filename), 'w')
        yaml.dump(r_data, streamFile)
        if resource.picture:
            image = Image.open(resource.picture.file)
            if image.mode not in ["1", "L", "P", "RGB", "RGBA"]:
                image = image.convert("RGB")
            image.save("%s/%s/%s/%s.png" %
                       (folder, resource.type, resource.vendor.name, filename))
    return HttpResponse("done")


def export_spaces(request):
    spaces = Space.objects.all()
    for space in spaces:
        s_data = {
            'name': space.name,
            'description': space.description,
            'city': space.city,
            'zip':  space.zip,
            'street': space.street,
            'country_code': space.country,
            'state_code': space.state,
            'latitude': space.latitude,
            'longitude': space.longitude,
            'founded': space.founded,
            'email': space.email,
            'website': space.website,
            'facebook': space.facebook,
            'twitter': space.twitter,
            'language': space.language,
            'events_ics': space.events_ics,
            'last_confirmed': space.last_confirmed,
            'machines': []
        }
        # add machines to space
        for sr in space.resources.all():
            data = sr.resource.model
            if sr.custom_data:
                data = {
                    'ref': sr.resource.model,
                }
                for key in sr.custom_data.keys():
                    data[key] = sr.custom_data[key]
            s_data['machines'].append(data)

        if space.custom_data:
            for key in space.custom_data.keys():
                s_data[key] = space.custom_data[key]
        folder = 'content/spaces'
        Path(folder).mkdir(parents=True, exist_ok=True)
        streamFile = open("%s/%s.yml" % (folder, space.slug), 'w')
        yaml.dump(s_data, streamFile)
        if space.logo:
            image = Image.open(space.logo.file)
            if image.mode not in ["1", "L", "P", "RGB", "RGBA"]:
               image = image.convert("RGB")
            image.save("%s/%s.png" % (folder, space.slug))
    return HttpResponse("done")

# API


class SpaceViewSet(viewsets.ModelViewSet):
    # TODO object based permissions
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    queryset = Space.objects.filter(show=True).all()
    filterset_fields = ('name', 'show')
    serializer_class = SpaceSerializer


class ResourcesViewSet(viewsets.ModelViewSet):
    # TODO object based permissions
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    queryset = Resource.objects.all()
    serializer_class = ResourceUpSerializer


class PostFilter(filters.FilterSet):
    space = filters.ModelMultipleChoiceFilter(queryset=Space.objects.all())

    class Meta:
        model = Post
        fields = ('type', 'space', 'source_type', 'show', 'created_at')

class PostViewSet(viewsets.ModelViewSet):
    # TODO object based permissions
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    queryset = Post.objects.filter(show=True).order_by('-created_at').all()
    serializer_class = PostSerializer
    filterset_class = PostFilter
    pagination_class = LimitOffsetPagination


class EventFilter(filters.FilterSet):
    space = filters.ModelMultipleChoiceFilter(queryset=Space.objects.all())

    class Meta:
        model = Event
        fields = ('space', 'startdate', 'location')


class EventViewSet(viewsets.ModelViewSet):
    # TODO object based permissions
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = EventSerializer
    filterset_class = EventFilter
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        queryset = Event.objects.all()
        direction = self.request.query_params.get('direction', '1')
        # future and ongoing
        if direction == '1':
            queryset = queryset.filter(
                enddate__gte=date.today()).order_by('startdate')
        else:
            queryset = queryset.filter(
                enddate__lt=date.today()).order_by('-startdate')
        return queryset
