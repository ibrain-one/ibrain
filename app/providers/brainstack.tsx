'use client';
import { createBrainstack } from '@brainstack/react';
import { Communication } from '../hooks/useCommunicationManager';

export type TStoreState = {
  isSpeaking?: boolean;
  isRecognizing?: boolean;
  language?: string;
  history?: Communication[];
};

export enum EventNames {
  SpeechSpeaking = 'speech.speaking',
  SpeechSilent = 'speech.silent',
  Speech2TextResult = 'speech2text.result',
  CommunicationUser = 'communication.user',
  CommunicationAI = 'communication.ai',
  IBrainSpeak = 'ibrain.speak',
}

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
  stateOptions: { isSpeaking: false, isRecognizing: false, language:window?.navigator?.language ?? 'en-CA', history: [] },
  loggerOptions: [5]
});

export type TStateSelector = (state: TStoreState) => Partial<TStoreState>;
