# -*- coding: utf-8 -*-

"""
Drop shadows with PIL.

Author: Kevin Schluff
License: Python license
"""
from PIL import Image, ImageFilter

def drop_shadow( image, offset=(0,0), background=0xffffff, shadow=(0x44,0x44,0x44,0xff),
                border=20, iterations=30):
  """
  Add a gaussian blur drop shadow to an image.

  image       - The image to overlay on top of the shadow.
  offset      - Offset of the shadow from the image as an (x,y) tuple.  Can be
                positive or negative.
  background  - Background colour behind the image.
  shadow      - Shadow colour (darkness).
  border      - Width of the border around the image.  This must be wide
                enough to account for the blurring of the shadow.
  iterations  - Number of times to apply the filter.  More iterations
                produce a more blurred shadow, but increase processing time.
  """

  # Create the backdrop image -- a box in the background colour with a
  # shadow on it.
  totalWidth = image.size[0] + abs(offset[0]) + 2*border
  totalHeight = image.size[1] + abs(offset[1]) + 2*border
  back = Image.new('RGBA', (totalWidth, totalHeight), background)

  length = 6
  # Place the shadow, taking into account the offset from the image
  shadowLeft = border + max(offset[0], 0) - length
  shadowTop = border + max(offset[1], 0) - length
  back.paste(shadow, [shadowLeft, shadowTop, shadowLeft + image.size[0] + 2*length,
    shadowTop + image.size[1] + 2*length] )

  # Apply the filter to blur the edges of the shadow.  Since a small kernel
  # is used, the filter must be applied repeatedly to get a decent blur.
  n = 0
  while n < iterations:
    back = back.filter(ImageFilter.BLUR)
    n += 1

  # Paste the input image onto the shadow backdrop
  imageLeft = border - min(offset[0], 0)
  imageTop = border - min(offset[1], 0)
  back.paste(image, (imageLeft, imageTop))

  return back

