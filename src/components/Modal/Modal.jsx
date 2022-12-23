import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

const modalRoot = document.querySelector('#modal-root');

const Modal = ({ url, alt, close, children }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    console.log('add listner keydown');
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      console.log('dell listner keydown');
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  const handleKeyDown = event => {
    if (event.code === 'Escape') {
      close();
    }
  };

  const handleOverlayClick = event => {
    if (event.currentTarget === event.target) {
      close();
    }
  };

  const onLoad = e => {
    if (e.type === 'load') {
      setImgLoaded(true);
    }
  };

  return createPortal(
    <div className="Overlay" onClick={handleOverlayClick}>
      <div className="Modal">
        {!imgLoaded && children}
        <img src={url} alt={alt} onLoad={onLoad} />
      </div>
    </div>,
    modalRoot
  );
};

export { Modal };

Modal.propTypes = {
  close: PropTypes.func,
  url: PropTypes.string,
  alt: PropTypes.string,
};
