"use client";
import { createBrainstack } from '@brainstack/react';


export const {
  BrainStackProvider, useBrainStack, core, createEventHandlerMutator, createEventHandlerMutatorShallow
} = createBrainstack({
  eventHubOptions: [],
  //@ts-ignore
  stateOptions: { communications: [], isSpeaking: false },
  loggerOptions: [5]
});
