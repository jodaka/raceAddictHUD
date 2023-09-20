let recordedBlobs: Blob[];
let mediaRecorder: MediaRecorder;

export function startRecording(stream: MediaStream): () => Blob | null {
  let options: any = { mimeType: 'video/webm; codecs=vp9' };
  recordedBlobs = [];
  try {
    mediaRecorder = new MediaRecorder(stream, options);
  } catch (e0) {
    console.warn('Unable to create MediaRecorder with options Object: ', e0);

    try {
      options = 'video/vp8'; // Chrome 47
      mediaRecorder = new MediaRecorder(stream, options);
    } catch (e2) {
      console.error('Exception while creating MediaRecorder:', e2);
      return () => null;
    }
  }

  function handleStop() {
    mediaRecorder.stop();
    return new Blob(recordedBlobs, { type: 'video/webm' });
  }

  mediaRecorder.ondataavailable = (event: BlobEvent) => {
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data);
    }
  };

  mediaRecorder.start(100); // collect 100ms of data

  return handleStop;
}
