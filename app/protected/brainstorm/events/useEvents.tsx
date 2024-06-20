'use client';
import useSpeechAction from './useSpeechAction';
import useVoicePermissionAccepted from './useVoicePermissionAccepted';

export default function useEvents() {
  useVoicePermissionAccepted();
  useSpeechAction()
}
