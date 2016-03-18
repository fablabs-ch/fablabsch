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


class ResourceDownSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
    vendor = VendorSerializer()


class SpaceShortField(serializers.ModelSerializer):
    class Meta:
        model = Space
        fields = ('id', 'name', 'slug', 'logo', 'facebook', 'twitter')


class SpaceResourceDownSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpaceResource
    resource = ResourceDownSerializer()


class SpaceResourceUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpaceResource
    space = SpaceShortField(read_only=True)


class SpaceResourceUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpaceResource
    space = SpaceShortField(read_only=True)


class ResourceUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
    vendor = VendorSerializer()
    spaces = SpaceResourceUpSerializer(many=True, read_only=True)


class SpaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Space
    resources = SpaceResourceDownSerializer(many=True, read_only=True)


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
    images = PostImageSerializer(many=True, read_only=True)
    space = SpaceShortField(read_only=True)
