import { useState } from 'react';
import { PropTypes } from 'prop-types';
import Box from 'components/Box';
import { ImageLoader } from 'components/Loader';
import { Modal } from 'components/Modal';

const ImageGalleryItem = ({ imgUrl, tags, largeImageURL, imgId, onLoad }) => {
  const [loaded, setLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pictureAlt, setPictureAlt] = useState('');
  const [pictureLargeUrl, setPictureLargeUrl] = useState('');
  // const [errorMessage, setErrorMessage] = useState(null);

  const checkImgLoad = event => {
    const isImageLoaded = event.type === 'load';

    if (isImageLoaded) {
      setLoaded(true);
      onLoad(true);
    }
  };

  const onPreview = (url, alt) => {
    setPictureLargeUrl(url);
    setPictureAlt(alt);
    toggleModal();
  };

  const toggleModal = () => {
    setShowModal(prevState => !prevState);
  };

  return (
    <Box>
      {showModal && (
        <Modal url={pictureLargeUrl} alt={pictureAlt} close={toggleModal}>
          <ImageLoader />
        </Modal>
      )}

      <li
        className="GalleryItem"
        id={imgId}
        onClick={() => onPreview(largeImageURL, tags)}
      >
        <Box className="ImageWraper">
          {!loaded && <ImageLoader />}
          <img
            className="ImageGalleryItem-image"
            src={imgUrl}
            alt={tags}
            onLoad={checkImgLoad}
          />
        </Box>
      </li>
    </Box>
  );
};

export { ImageGalleryItem };

ImageGalleryItem.propType = {
  imgUrl: PropTypes.string,
  largeImageURL: PropTypes.string,
  imgId: PropTypes.string,
  tags: PropTypes.string,
  onPreview: PropTypes.func,
  onLoad: PropTypes.func,
};
