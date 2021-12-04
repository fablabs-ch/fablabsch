from facebook_scraper import get_posts
for post in get_posts('FabLab.winti', pages=1):
    print(post)
    