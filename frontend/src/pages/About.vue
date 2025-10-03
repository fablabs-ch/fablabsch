<template>
  <v-container>
    <h1>About</h1>
    <p>
      Fablabs.ch is promoting the MIT concept of Fab Labs in the geographical territory of Switzerland.
    </p>
    <p>
      It provides a central location to see activities of swiss fab labs by aggregating their public social network feeds.
    </p>
    <p class="my-5">
      <v-btn
        href="https://docs.google.com/forms/d/1tPK7CAc_udVFaZOikjJVoXztbVOJ_-vZfB-Ymq2u8qw/viewform"
        target="_blank"
        color="primary"
        class="mr-3 mb-2"
      >
        Contact Swiss Fablabs.ch
      </v-btn>
      <v-btn
        href="https://fablabs-ch.slack.com"
        target="_blank"
        color="primary"
        class="mr-3 mb-2"
      >
        Slack fablabs-ch
      </v-btn>
      <v-btn
        href="https://github.com/orgs/fablabs-ch/"
        target="_blank"
        color="primary"
        class="mb-2"
      >
        Github fablabs-ch
      </v-btn>
    </p>

    <p>
      The FabLab concept is described in the
      <a href="https://fab.cba.mit.edu/about/charter/" target="_blank">Fab Charter</a>, copied below:
    </p>

    <h2>The Fab Charter</h2>

    <dl>
      <dt>What is a fab lab?</dt>
      <dd>
        Fab labs are a global network of local labs, enabling invention by providing access to tools for digital fabrication
      </dd>
      <dt>What's in a fab lab?</dt>
      <dd>
        Fab labs share an evolving inventory of core capabilities to make (almost) anything, allowing people and projects to be shared
      </dd>
      <dt>What does the fab lab network provide?</dt>
      <dd>
        Operational, educational, technical, financial, and logistical assistance beyond what's available within one lab
      </dd>
      <dt>Who can use a fab lab?</dt>
      <dd>
        Fab labs are available as a community resource, offering open access for individuals as well as scheduled access for programs
      </dd>
      <dt>What are your responsibilities?</dt>
      <dd>
        safety: not hurting people or machines<br />
        operations: assisting with cleaning, maintaining, and improving the lab<br />
        knowledge: contributing to documentation and instruction
      </dd>
      <dt>Who owns fab lab inventions?</dt>
      <dd>
        Designs and processes developed in fab labs can be protected and sold however an inventor chooses, but should remain available for individuals to use and learn from
      </dd>
      <dt>How can businesses use a fab lab?</dt>
      <dd>
        Commercial activities can be prototyped and incubated in a fab lab, but they must not conflict with other uses, they should grow beyond rather than within the lab, and they are expected to benefit the inventors, labs, and networks that contribute to their success
      </dd>
    </dl>
  </v-container>
</template>

<script>
export default {
  name: 'AboutPage',
}
</script>

<style scoped>
dl {
  margin-top: 1em;
}

dt {
  font-weight: bold;
  margin-top: 1em;
}

dd {
  margin-left: 1em;
  margin-bottom: 0.5em;
}
</style>
