"""fablabadmin URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from django.views.generic import TemplateView
from rest_framework import routers

from fablabsch import views

admin.autodiscover()

router = routers.DefaultRouter(trailing_slash=False)


router.register(r'spaces', views.SpaceViewSet)
router.register(r'resources', views.ResourcesViewSet)
router.register(r'posts', views.PostViewSet)

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^i18n/', include('django.conf.urls.i18n')),
    url(r'^cron/import', views.cron_import),
    url(r'^cron/fablabsio', views.cron_fablabsio),
    url(r'^cron/fablabis', views.cron_fablabis),
    url(r'^import/facebook/(?P<facebook_id>.+)$', views.facebook_page_import),

]
