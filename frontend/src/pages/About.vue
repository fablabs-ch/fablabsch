<template>
  <v-container>
    <h1>About Swiss FabLabs</h1>
    <p>
      This website aggregates information about FabLabs in Switzerland.
    </p>
    <h2>Features</h2>
    <ul>
      <li>Display a map of FabLabs</li>
      <li>List of machines available in FabLabs</li>
      <li>Individual pages for each FabLab</li>
    </ul>
    <h2>Contribution</h2>
    <p>
      Create issue or pull request for updates.
    </p>
    <ul>
      <li>To add a lab copy the content/spaces/_template.yml file</li>
      <li>To edit a lab update the content/spaces/fablab_[name].yml file (name must be lowercase without spaces)</li>
      <li>A lab logo must be a png, jpg or jpeg file at the same location with minimum size of 160x160px</li>
      <li>Machines are defined in the content/machines/[type]/[vendor]/[model].yml file</li>
    </ul>
    <p>
      <v-btn
        href="https://github.com/fablabs-ch/fablabsch"
        target="_blank"
        color="primary"
      >
        <v-icon>mdi-github</v-icon> View on GitHub
      </v-btn>
    </p>
  </v-container>
</template>

<script>
export default {
  name: 'AboutPage',
}
</script>
