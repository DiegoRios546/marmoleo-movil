import 'dotenv/config';

export default {
  expo: {
    name: "marmoleo_express_movil",
    slug: "marmoleo_express_movil",
    version: "1.0.0",
    extra: {
      apiUrl: process.env.API_URL,
    },
  },
};
