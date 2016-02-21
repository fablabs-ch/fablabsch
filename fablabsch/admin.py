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

