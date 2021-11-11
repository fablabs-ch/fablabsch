<template>
  <Layout>
    <v-container>
      <ClientOnly>
        <space-filter @filteredSpaces="onFilteredSpaces" />

        <div
          v-masonry
          transition-duration="0.1s"
          item-selector=".post"
        >
          <div
            v-for="p in posts"
            :key="p.id"
            v-masonry-tile
            class="post col-12 col-sm-6 col-md-4 py-2 pa-sm-2 pa-md-3"
          >
            <v-card>
              <v-list-item dense>
                <v-list-item-avatar>
                  <v-btn :to="`/space/${p.space.slug}`" icon tile>
                    <img
                      :src="
                        spaceLogoThumb({
                          id: p.space.slug,
                          fileInfo: { fallback: false },
                        })
                      "
                    >
                  </v-btn>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ p.space.name }} {{ p.type }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ formatDate(p.created_at) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn
                    v-if="p.source_type == 'FACEBOOK'"
                    icon
                    tile
                    target="_blank"
                    :href="`https://www.facebook.com/${
                      p.source_id.split('_')[0]
                    }/posts/${p.source_id.split('_')[1]}`"
                  >
                    <v-icon>mdi-facebook</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="p.source_type == 'TWITTER'"
                    icon
                    tile
                    target="_blank"
                    :href="`https://www.twitter.com/${p.space.twitter}/status/${p.source_id}`"
                  >
                    <v-icon>mdi-twitter</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>

              <a v-if="p.images.length > 0" :href="p.link" target="_blank">
                <v-img :src="p.images[0].src" alt="" />
              </a>
              <v-card-title
                v-if="p.message.split('\n\n').length > 1"
                class="links"
              >
                <a :href="p.link" target="_blank">{{
                  p.message.split("\n\n")[0]
                }}</a>
              </v-card-title>
              <v-card-text class="black--text links">
                <div v-html="format(p.message)" />
                <div class="thumbs">
                  <a
                    v-for="(i, index) in p.images.slice(1)"
                    :key="index"
                    :href="i.link"
                    :title="i.title"
                  ><v-img :src="i.src" /></a>
                </div>
              </v-card-text>
            </v-card>
          </div>
        </div>
        <infinite-loading
          :identifier="infiniteId"
          spinner="waveDots"
          @infinite="infiniteHandler"
        >
          <div slot="no-more">
            You've scrolled through all the posts ;)
          </div>
          <div slot="no-results">
            Loading
          </div>
        </infinite-loading>
      </ClientOnly>
    </v-container>
  </Layout>
</template>

<script>
import SpaceFilter from "@/components/SpaceFilter.vue";
import { spaceLogoThumb } from "@/utils/fallback";

const API_ENDPOINT = "https://fablab.ch/";

export default {
  metaInfo: {
    title: "News",
  },
  components: {
    SpaceFilter,
    InfiniteLoading: () => import("vue-infinite-loading"),
  },
  data() {
    return {
      infiniteId: 0,
      posts: [],
      currentCount: 0,
      totalCount: 0,
      next: undefined,
    };
  },
  methods: {
    spaceLogoThumb,
    format(message) {
      const n = message.split("\n\n");
      if (n.length === 1) {
        return message;
      } else {
        return n.slice(1).join("<br/>");
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    },
    async onFilteredSpaces(filteredSpaces) {
      this.currentCount = 0;
      this.posts = [];
      this.next =
        API_ENDPOINT +
        "api/posts?limit=10&offset=0&show=1" +
        Object.keys(filteredSpaces).reduce((filter, slug) => {
          if (filteredSpaces[slug]) {
            filter += `&space__slug=${slug}`;
          }
          return filter;
        }, "");
      await this.loadMore();
      this.infiniteId += 1;
    },
    async loadMore() {
      if (!this.next) return;
      const results = await fetch(this.next, {
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        this.posts = [];
        this.currentCount = 0;
        return {
          results: [], // TODO error post
          next: undefined,
          count: 0,
        };
      });
      this.posts = this.posts.concat(results.results);
      this.next = results.next;
      this.currentCount += results.results.length;
      this.totalCount = results.count;
    },
    async infiniteHandler($state) {
      if (this.currentCount + 1 > this.totalCount) {
        $state.complete();
      } else {
        await this.loadMore();
        $state.loaded();
      }
    },
  },
};
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: ease opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.links a {
  text-decoration: none;
}
.links a:hover {
  text-decoration: underline;
}
</style>
