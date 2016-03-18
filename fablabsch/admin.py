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
from django.contrib import admin
from django.utils.html import format_html
from reversion_compare.admin import CompareVersionAdmin

from fablabsch.models import *


@admin.register(Space)
class SpaceAdmin(CompareVersionAdmin):
    model = Space
    prepopulated_fields = {"slug": ("name",)}
    list_filter = ('show',)


@admin.register(SpaceResource)
class SpaceResourceAdmin(CompareVersionAdmin):
    pass


@admin.register(Resource)
class ResourceAdmin(CompareVersionAdmin):
    pass


@admin.register(Vendor)
class VendorAdmin(CompareVersionAdmin):
    pass


@admin.register(PostImage)
class PostImageAdmin(CompareVersionAdmin):
    model = PostImage

    list_display = ('preview',)
    readonly_fields = ('preview',)

    def preview(self, obj):
        if obj.src:
            return format_html('<img src="{}" style="width:200px">', obj.src)
        return obj



class PostImageInline(admin.TabularInline):
    model = PostImage
    extra = 0
    fields = ('preview', 'src', 'image', 'link')
    readonly_fields = ('preview',)

    def preview(self, obj):
        if obj.src:
            return format_html('<img src="{}" style="width:200px">', obj.src)
        return obj


@admin.register(Post)
class PostAdmin(CompareVersionAdmin):
    inlines = (PostImageInline,)

