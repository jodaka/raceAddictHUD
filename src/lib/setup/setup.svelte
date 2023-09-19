<script lang="ts">
  import type { ICSVRecord } from '$lib/types';
  import { parseCSV } from '$lib/utils';

  export let onSubmit = (csv: ICSVRecord[], video: File) => {};
  export let csv: ICSVRecord[] | null;

  let parsedCSV: ICSVRecord[];
  let selectedVideo: File;
  let selectedVideoUrl: string;

  $: if (csv?.length) {
    parsedCSV = csv;
  }

  // when user select CSV we try to parse it
  const handleSelectCsv = (evt: any) => {
    const file = evt.target?.files?.[0];
    const reader = new FileReader();
    reader.onloadend = (evt: ProgressEvent<FileReader>) => {
      parsedCSV = parseCSV((evt.target?.result || '') as string);
    };
    reader.readAsText(file);
  };

  const handleSelectVideo = (evt: any) => {
    const file = evt.target?.files?.[0];
    if (file) {
      selectedVideo = file;
      selectedVideoUrl = URL.createObjectURL(file);
    }
  };

  const handleSubmit = () => {
    onSubmit(parsedCSV, selectedVideo);
  };
</script>

<div class="setup">
  <label
    class="button button--left"
    role="button"
  >
    Выбрать CSV с данными
    <input
      type="file"
      accept="text/csv"
      on:change={handleSelectCsv}
    />
  </label>
  <div class="preview--left">
    {#if parsedCSV?.length}
      <p>CSV загружен</p>
      <ul>
        <li>Обработано записей {parsedCSV.length}</li>
      </ul>
    {/if}
  </div>

  <label
    class="button button--right"
    role="button"
  >
    Выбрать видео
    <input
      type="file"
      accept="video/*"
      on:change={handleSelectVideo}
    />
  </label>
  <div class="preview--right">
    {#if selectedVideo}
      <video
        controls={true}
        width="100%"
      >
        <source
          src={selectedVideoUrl}
          type="video/mp4"
        />
      </video>
    {/if}
  </div>

  <button
    class="button button--submit"
    disabled={!selectedVideo || !parsedCSV?.length}
    on:click={handleSubmit}>Продолжить →</button
  >
</div>

<style>
  .setup {
    display: grid;
    grid-template:
      'leftBtn rightBtn' 50px
      'leftPreview rightPreview' 1fr
      'submit submit' 50px
      / 1fr 1fr;

    grid-gap: 20px;
    height: 100%;
    width: 80%;
    align-items: center;
    padding: 20px;
  }

  .button--left {
    grid-area: leftBtn;
    justify-self: center;
  }

  .button--right {
    grid-area: rightBtn;
    justify-self: center;
  }

  .button--submit {
    grid-area: submit;
    justify-self: center;
  }

  .preview--right,
  .preview--left {
    background-color: #ececec;
    border-radius: 6px;
    grid-area: rightPreview;
    height: 100%;
    padding: 10px;
  }

  .preview--left {
    grid-area: leftPreview;
  }

  video {
    border-radius: 4px;
  }

  * {
    box-sizing: border-box;
  }

  input[type='file'] {
    display: none;
  }
</style>
