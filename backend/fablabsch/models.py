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
from ckeditor_uploader.fields import RichTextUploadingField
from django.utils.translation import ugettext_lazy as _
from django.db import models
from django.db.models import JSONField
from django.core.validators import URLValidator
from django.utils import timezone


class Vendor(models.Model):
    name = models.CharField(verbose_name=_('name'), max_length=30, blank=False, null=False)
    logo = models.ImageField(verbose_name=_('logo'), upload_to='vendor', blank=True, null=True)

    class Meta:
        ordering = ('name',)

    def __str__(self):
        return u'%s' % self.name

    @staticmethod
    def autocomplete_search_fields():
        return 'name',


class Resource(models.Model):
    model = models.CharField(verbose_name=_('model'), max_length=30, blank=False, null=False)
    #tags multi?
    type = models.CharField(verbose_name=_('type'), max_length=30, blank=False, null=False)
    vendor = models.ForeignKey(Vendor, verbose_name=_('vendor'), related_name='resources', on_delete=models.PROTECT)
    picture = models.ImageField(verbose_name=_('picture'), upload_to='resource', blank=True, null=True)
    custom_data = JSONField(verbose_name=_('custom data'), blank=True, null=True)

    class Meta:
        ordering = ('vendor__name', 'model')

    def __str__(self):
        return u'%s (%s)' % (self.model, self.vendor.name)

    @staticmethod
    def autocomplete_search_fields():
        return 'model', 'type', 'vendor__name'


class Space(models.Model):
    name = models.CharField(verbose_name=_('name'), max_length=100, blank=False, null=False)
    slug = models.SlugField(verbose_name=_('slug'), blank=False, null=False)
    description = models.TextField(verbose_name=_('description'), blank=True, null=False)
    city = models.CharField(verbose_name=_('city'), max_length=100, blank=True, null=False)
    country = models.CharField(verbose_name=_('country'), max_length=2, blank=False, null=False, default='CH')
    state = models.CharField(verbose_name=_('state'), max_length=20, blank=True, null=False)
    latitude = models.FloatField(verbose_name=_('latitude'),  blank=True, null=True)
    longitude = models.FloatField(verbose_name=_('longitude'),  blank=True, null=True)
    street = models.CharField(verbose_name=_('street'), max_length=100, blank=True, null=False)
    zip = models.CharField(verbose_name=_('zip'), max_length=20, blank=True, null=False)
    founded = models.DateField(verbose_name=_('founded'), blank=True, null=True)
    email = models.EmailField(verbose_name=_('email'), blank=True, null=False)
    website = models.URLField(verbose_name=_('website'), blank=True, null=False)
    facebook = models.CharField(verbose_name=_('facebook'), max_length=40, blank=True, null=True)
    twitter = models.CharField(verbose_name=_('twitter'), max_length=40, blank=True, null=True)
    logo = models.ImageField(verbose_name=_('logo'), upload_to='logo',blank=True, null=True)
    marker = models.ImageField(verbose_name=_('marker'), upload_to='marker',blank=True, null=True)
    background = models.ImageField(verbose_name=_('background'), upload_to='background', blank=True, null=True)
    type = models.CharField(verbose_name=_('type'), max_length=20, blank=False, null=False, default='FabLab')
    language = models.CharField(verbose_name=_('language'), max_length=20, blank=True, null=False)
    last_confirmed = models.DateField(verbose_name=_('last confirmed'), blank=True, null=True)
    show = models.BooleanField(verbose_name=_('show'), default=False)
    custom_data = JSONField(verbose_name=_('custom data'), blank=True, null=True)
    events_ics = models.URLField(verbose_name=_('events_ics'), max_length=800, blank=True, null=False)

    class Meta:
        ordering = ('name',)

    def __str__(self):
        return u'%s' % self.name

    @staticmethod
    def autocomplete_search_fields():
        return 'name',


class SpaceResource(models.Model):
    space = models.ForeignKey(Space, verbose_name=_('space'), related_name='resources', on_delete=models.CASCADE)
    resource = models.ForeignKey(Resource, verbose_name=_('resource'), related_name='spaces', on_delete=models.CASCADE)
    custom_data = JSONField(verbose_name=_('custom data'), blank=True, null=True)

    def __str__(self):
        return u'%s @ %s' % (self.resource, self.space.name)


class Post(models.Model):
    LINK = 'link'
    STATUS = 'status'
    PHOTO = 'photo'
    VIDEO = 'video'
    EVENT = 'event'
    TYPE_CHOICES = (
        (LINK, _('link')),
        (STATUS, _('status')),
        (PHOTO, _('photo')),
        (VIDEO, _('video')),
        (EVENT, _('event')),
    )
    FACEBOOK = 'FACEBOOK'
    TWITTER = 'TWITTER'
    type = models.CharField(verbose_name=_('type'), max_length=30, blank=False, null=False, choices=TYPE_CHOICES)
    source_type = models.CharField(verbose_name=_('source'), max_length=30, blank=False, null=False,
                                   choices=((FACEBOOK, 'Facebook'), (TWITTER, 'Twitter')))
    source_id = models.CharField(verbose_name=_('source id'), max_length=60, blank=True, null=False)
    space = models.ForeignKey(Space, verbose_name=_('space'), related_name='posts', on_delete=models.PROTECT)
    message = models.TextField(verbose_name=_('message'), blank=True, null=False)
    link = models.TextField(verbose_name=_('link'), validators=[URLValidator()], blank=True, null=False)
    show = models.BooleanField(verbose_name=_('show'), default=True)
    created_at = models.DateTimeField(verbose_name='created at', default=timezone.now)

    class Meta:
        ordering = ('-created_at',)
        unique_together = (('source_type', 'source_id'),)

    def __str__(self):
        return u'%s %s %s %s' % (self.space.name, self.source_type, self.type, self.id)


class PostImage(models.Model):
    src = models.URLField(verbose_name=_('src'), max_length=800, blank=True, null=False)
    width = models.PositiveIntegerField(verbose_name=_('width'), blank=True, null=True)
    height = models.PositiveIntegerField(verbose_name=_('height'), blank=True, null=True)
    title = models.TextField(verbose_name=_('title'), blank=True, null=False)
    link = models.TextField(verbose_name=_('link'), validators=[URLValidator()], blank=True, null=False)
    image = models.ImageField(verbose_name=_('image'), upload_to='post', blank=True, null=True)
    post = models.ForeignKey(Post, verbose_name=_('post'), related_name='images', on_delete=models.CASCADE)


class Event(models.Model):
    uid = models.CharField(verbose_name=_('uid'), max_length=200, blank=False, null=False, primary_key=True)
    startdate = models.DateTimeField(verbose_name='startdate', blank=False)
    enddate = models.DateTimeField(verbose_name='enddate', blank=False)
    modified = models.DateTimeField(verbose_name='modified', blank=False)
    summary = models.TextField(verbose_name=_('summary'), blank=True, null=False)
    description = models.TextField(verbose_name=_('description'), blank=True, null=False)
    location = models.CharField(verbose_name=_('location'), max_length=200, blank=True, null=False)
    image_src = models.URLField(verbose_name=_('external image url'), max_length=800, blank=True, null=False)
    image = models.ImageField(verbose_name=_('image'), upload_to='event', blank=True, null=True)
    space = models.ForeignKey(Space, verbose_name=_('space'), related_name='events', on_delete=models.CASCADE)

    class Meta:
        ordering = ('-startdate',)

    def __str__(self):
        return u'%s %s %s' % (self.summary, self.startdate, self.enddate)


class Page(models.Model):
    slug = models.SlugField(verbose_name=_('slug'), blank=False, null=False, primary_key=True)
    title = models.CharField(verbose_name=_('title'), max_length=255, blank=True, null=False)
    content = RichTextUploadingField(verbose_name=_('content'))
    modified_at = models.DateTimeField(verbose_name='modified at', auto_now=True)

    def __str__(self):
        return u'%s (%s.html)' % (self.title, self.slug)

