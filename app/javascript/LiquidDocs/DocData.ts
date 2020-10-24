import data from '../../../liquid_doc.json';

export type YardTag = {
  tag_name: string;
  name: string | null;
  text: string;
  types: string[] | null;
};

export type YardMethod = {
  name: string;
  docstring: string;
  tags: YardTag[];
};

export type YardClass = {
  name: string;
  superclasses: string[];
  docstring: string;
  tags: YardTag[];
  methods: YardMethod[];
};

export type YardDocs = {
  classes: YardClass[];
  filter_methods: YardMethod[];
};

const typedData: YardDocs = data;

export default typedData;
