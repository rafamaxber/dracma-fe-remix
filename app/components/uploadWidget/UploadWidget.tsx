import { useMatches } from '@remix-run/react'
import { useEffect, useRef } from 'react';

export function UploadWidget({ children, onUpload }) {
  const matches = useMatches()
  const { ENV } = matches.find(route => route.id === 'root')?.data ?? {}
  const widget = useRef();

  function createWidget() {
    if ('cloudinary' in window) {
      return window.cloudinary.createUploadWidget({
        cloudName: ENV.CLOUDINARY_CLOUD_NAME,
        uploadPreset: ENV.CLOUDINARY_UPLOAD_PRESET,
        multiple: true,
        maxFiles: 5,
        clientAllowedFormats: 'image',
        // maxFileSize: 1000000, // 1MB
        // validateMaxWidthHeight: true,
        // maxImageWidth: 800,
        // maxImageHeight: 800,
        // cropping: true,
        // language: 'pt',
      }, (error, result) => {
        if ((error || result.event === 'success') && typeof onUpload === 'function') {
          onUpload(error, result, widget);
        }
      })
    }
  }

  function open() {
    if (widget.current) {
      widget.current.open()
    }
  }

  useEffect(() => {
    function onIdle() {
      if (!widget.current) {
        widget.current = createWidget()
      }
    }

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(onIdle)
    } else {
      setTimeout(onIdle, 0)
    }

    return () => {
      widget.current?.destroy();
      widget.current = undefined;
    }
  }, [])

  return children({
    widget,
    open,
})
}
