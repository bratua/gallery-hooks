import PropTypes from 'prop-types';
import Box from 'components/Box';
import { ImageGalleryItem } from 'components/ImageGalleryItem';

const ImageGallery = ({ pictures, onLoadImg }) => {
  if (pictures.length === 0) {
    return (
      <Box
        display="flex"
        textAlign="centercd"
        flexDirection="column"
        height="900px"
        alignItems="center"
        justifyContent="center"
        fontSize="100px"
      >
        <h3>Pixabay Search Pictures Machine</h3>
        <p>by LSP</p>
      </Box>
    );
  }

  return (
    <Box>
      <ul className="ImageGallery" id="imageGallery">
        {pictures.map(({ id, webformatURL, largeImageURL, tags }) => (
          <ImageGalleryItem
            key={id}
            imgUrl={webformatURL}
            largeImageURL={largeImageURL}
            imgId={id}
            tags={tags}
            onLoad={onLoadImg}
          />
        ))}
      </ul>
    </Box>
  );
};

ImageGallery.propTypes = { pictures: PropTypes.arrayOf(PropTypes.object) };

export { ImageGallery };
