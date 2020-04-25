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

from rest_framework import serializers
from .models import *


class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = '__all__' 


class ResourceDownSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = '__all__'
    vendor = VendorSerializer()


class SpaceShortField(serializers.ModelSerializer):
    class Meta:
        model = Space
        fields = ('id', 'name', 'slug', 'logo', 'marker', 'facebook', 'twitter')


class SpaceResourceDownSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpaceResource
        fields = '__all__'
    resource = ResourceDownSerializer()


class SpaceResourceUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpaceResource
        fields = '__all__'
    space = SpaceShortField(read_only=True)


class SpaceResourceUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpaceResource
        fields = '__all__'
    space = SpaceShortField(read_only=True)


class ResourceUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = '__all__'
    vendor = VendorSerializer()
    spaces = SpaceResourceUpSerializer(many=True, read_only=True)


class SpaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Space
        fields = '__all__'
    resources = SpaceResourceDownSerializer(many=True, read_only=True)


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
    images = PostImageSerializer(many=True, read_only=True)
    space = SpaceShortField(read_only=True)


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'
    space = SpaceShortField(read_only=True)