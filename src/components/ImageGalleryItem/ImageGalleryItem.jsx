import { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
import Box from 'components/Box';
import { ImageLoader } from 'components/Loader';
import { Modal } from 'components/Modal';

export class ImageGalleryItem extends PureComponent {
  static propType = {
    imgUrl: PropTypes.string,
    largeImageURL: PropTypes.string,
    imgId: PropTypes.string,
    tags: PropTypes.string,
    onPreview: PropTypes.func,
    onLoad: PropTypes.func,
  };

  state = {
    loaded: false,
    showModal: false,
    pictureAlt: '',
    pictureLargeUrl: '',
    errorMessage: null,
  };

  checkImgLoad = event => {
    const isImageLoaded = event.type === 'load';

    if (isImageLoaded) {
      this.setState({ loaded: true });
      this.props.onLoad(true);
    }
  };

  onPreview = (url, alt) => {
    this.setState({ pictureAlt: alt, pictureLargeUrl: url });
    this.toggleModal();
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
  };

  render() {
    const { imgUrl, tags, largeImageURL, imgId } = this.props;
    const { showModal, pictureAlt, pictureLargeUrl } = this.state;

    return (
      <Box>
        {showModal && (
          <Modal
            url={pictureLargeUrl}
            alt={pictureAlt}
            close={this.toggleModal}
          >
            <ImageLoader />
          </Modal>
        )}

        <li
          className="GalleryItem"
          id={imgId}
          onClick={() => this.onPreview(largeImageURL, tags)}
        >
          <Box className="ImageWraper">
            {!this.state.loaded && <ImageLoader />}
            <img
              className="ImageGalleryItem-image"
              src={imgUrl}
              alt={tags}
              onLoad={this.checkImgLoad}
            />
          </Box>
        </li>
      </Box>
    );
  }
}
