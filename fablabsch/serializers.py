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
