'use client';
import useSpeechAction from './useSpeechAction';
import useToolSignIn from './useToolSignIn';
import useVoicePermissionAccepted from './useVoicePermissionAccepted';

export default function useEvents() {
  useToolSignIn();
  useVoicePermissionAccepted();
  useSpeechAction()
}
