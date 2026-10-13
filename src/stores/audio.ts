import { create } from "zustand";

export type AudioStatusStore = {
  isPlaying: boolean;
  _playingCount: number;
  _pendingCount: number;
  setPlaying: (isPlaying: boolean) => void;
  setPending: (isPending: boolean) => void;
  resetPlaying: () => void;
};

export const useAudioStatus = create<AudioStatusStore>((set) => ({
  isPlaying: false,
  _playingCount: 0,
  _pendingCount: 0,
  setPlaying: (playing) =>
    set((state) => {
      const _playingCount = Math.max(
        0,
        state._playingCount + (playing ? 1 : -1),
      );
      return {
        _playingCount,
        isPlaying: _playingCount > 0 || state._pendingCount > 0,
      };
    }),
  // Autoplay agendado que ainda não começou a tocar. Conta como tocando para o
  // aluno não responder antes de ouvir o enunciado (ver useCreateSound).
  setPending: (pending) =>
    set((state) => {
      const _pendingCount = Math.max(
        0,
        state._pendingCount + (pending ? 1 : -1),
      );
      return {
        _pendingCount,
        isPlaying: state._playingCount > 0 || _pendingCount > 0,
      };
    }),
  // Não zera os pendentes: o reset da questão roda depois do mount dos sons da
  // questão nova, e cada som devolve o seu ao tocar, falhar ou desmontar.
  resetPlaying: () =>
    set((state) => ({ _playingCount: 0, isPlaying: state._pendingCount > 0 })),
}));
