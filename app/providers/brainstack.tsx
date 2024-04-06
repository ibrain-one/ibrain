"use client";
import { createBrainstack } from '@brainstack/react';


export const {
  BrainStackProvider, useBrainStack, core, createEventHandlerMutator, createEventHandlerMutatorShallow,getValue
} = createBrainstack({
  eventHubOptions: [],
  //@ts-ignore
  stateOptions: { communications: [], isSpeaking: false, history:[] },
  loggerOptions: [5]
});
