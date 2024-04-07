import { createTool } from "./createTool";

export const weatherTool = createTool(
    'getWeatherFromCity',
    'Useful to retrieve weather for a specific city. If the city is not specified, the tool will attempt to use a default or return "unknown".',
    [],
    {
      city: {
        type: 'string',
        description:
          'The city to get weather for. Optional. If not provided, the behavior depends on the implementation.',
        optional: true
      }
    },
    async ()=>{return 'It is cloudy and coldy 6 degree celcius!'}
  );