'use client';
import { createBrainstack } from '@brainstack/react';

export const {
  BrainStackProvider,
  useBrainStack,
  core,
  createEventHandlerMutator,
  createEventHandlerMutatorShallow,
  getValue
} = createBrainstack({
  eventHubOptions: [],
  //@ts-ignore
  stateOptions: { isSpeaking: false, isRecognizing: false, language: 'en-CA', history: [] },
  loggerOptions: [5]
});