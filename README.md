# fablabsch
Community website for swiss fablabs: https://fablabs.ch

## Features
- Aggregates twitter and facebook posts
- Display a map of FabLabs
- List of machines available in FabLabs
- Aggregates Events through ics feeds (google calendar,...)
  + Used event fields: dates, summary, description
  + description field is parsed for #tags and url
  + first url becomes the official link to the event
  + one image is supported, first attachment link (icalendar ATTACH)

## Contribution
Create issue or pull request for udpates.

- To add a lab copy the content/spaces/_template.yml file
- To edit a lab update the content/spaces/fablab_[name].
yml file (name must be lowercase without spaces)
- A lab logo must be a png file at the same loaction with minimum size of 160x160px

- Machines are defined in the content/machines/[type]/[vendor]/[model].yml file
- Type used must be listed in the frontend/src/data/machine_types.yml file.

## Development

### Frontend
  Vue.js gridsome application creating lab pages from [content](./content) folder

  Thumbnail generation and image conversion are handled on build and develop script

### Backend
  Django REST application for parsing twitter and facebook and exposing an api consumed by the frontend

  *Space, Resource, SpaceResource are no longer taken from backend but via content folder.*
