import 'vuetify/_styles.scss';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { VDateInput } from 'vuetify/labs/VDateInput'

export default createVuetify({
  components:{
    ...components,
    VDateInput,
  },
  directives,
});
