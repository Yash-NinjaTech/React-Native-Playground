import {searchActivitiesAndGetDetailsV4} from '@/simplenight-sdk/activities-index';
import {getCoordinatesForLocation} from '../tools/geocodeTool';

const {z} = require('zod');
const {BufferMemory} = require('langchain/memory');
const {MessagesPlaceholder} = require('langchain/prompts');
const {initializeAgentExecutorWithOptions} = require('langchain/agents');
const {ChatOpenAI} = require('langchain/chat_models/openai');
const {DynamicStructuredTool} = require('langchain/tools');

export const makeActivitySearchAgent = async () => {
  const model = new ChatOpenAI({
    temperature: 0,
    modelName: 'gpt-4o',
  });
  const tools = [
    new DynamicStructuredTool({
      name: 'activity-search',
      description: 'searches for activity options',
      schema: z.object({
        startDate: z
          .string()
          .describe('The start date of the search formatted as YYYY-MM-DD'),
        endDate: z
          .string()
          .describe('The end date of the search formatted as YYYY-MM-DD'),
        dstGeolocation: z
          .string()
          .describe(
            'The location of the desired activities, must be formatted in latitude and longitude coordinates',
          ),
      }),
      func: async ({
        startDate,
        endDate,
        dstGeolocation,
      }: {
        startDate: string;
        endDate: string;
        dstGeolocation: string;
      }) => searchActivitiesAndGetDetailsV4(startDate, endDate, dstGeolocation),
      returnDirect: true, // This is an option that allows the tool to return the output directly
    }),

    new DynamicStructuredTool({
      name: 'geocode',
      description:
        'when given a location name, it converts it into a latitude and longitude coordinate to help solve the greater problem of finding an activity',
      schema: z.object({
        location: z
          .string()
          .describe('the name of the location to convert into a coordinate'),
      }),
      func: async ({location}: {location: string}) =>
        getCoordinatesForLocation(location), // Outputs still must be strings
      returnDirect: false, // This is an option that allows the tool to return the output directly
    }),
  ];

  const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: 'structured-chat-zero-shot-react-description',
    verbose: true,
    memory: new BufferMemory({
      memoryKey: 'chat_history',
      returnMessages: true,
    }),
    agentArgs: {
      inputVariables: ['input', 'agent_scratchpad', 'chat_history'],
      memoryPrompts: [new MessagesPlaceholder('chat_history')],
      prefix: ` you are a friendly travel agent chatbot helping a user find some activity options for thier trip. Be nice, gentle, and sweet.`,
    },
  });

  return executor;
};
