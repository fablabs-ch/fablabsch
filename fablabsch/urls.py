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

from django.conf import settings
from django.urls import include, path, re_path
from django.contrib import admin
from django.views.generic import TemplateView
from rest_framework import routers

from fablabsch import views

admin.autodiscover()

router = routers.DefaultRouter(trailing_slash=False)


router.register(r'spaces', views.SpaceViewSet)
router.register(r'resources', views.ResourcesViewSet)
router.register(r'posts', views.PostViewSet)
router.register(r'events', views.EventViewSet, basename='event')

urlpatterns = [
    path('jet/', include('jet.urls', 'jet')),
    path('admin/', admin.site.urls),
    re_path(r'^pages/(?P<page_slug>.+)\.html$', views.pages),
    path('ckeditor/', include('ckeditor_uploader.urls')),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('i18n/', include('django.conf.urls.i18n')),
    path('cron/import', views.cron_import),
    path('cron/fablabsio', views.cron_fablabsio),
    path('cron/fablabis', views.cron_fablabis),
    path('cron/events', views.ical_import),
    re_path(r'^import/facebook/(?P<facebook_id>.+)$', views.facebook_page_import),

]
if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns