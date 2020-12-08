import React from 'react';
import { Image, Text, Link } from '@sitecore-jss/sitecore-jss-react';
import Carousel from 'react-bootstrap/Carousel';


const MyCarousel = (props) => {
  // Query results in integrated GraphQL replace the normal `fields` data
  // i.e. with { data, }
  const { datasource } = props.fields.data;

  return (
      datasource && (
        <Carousel>
            {datasource.children.map((child) => (
              <Carousel.Item interval={child.wait.value}>
                <Image
                      field={child.img.jss}
                      editable={true}
                      height="500"
                      className="d-block w-100"
                      data-sample="other-attributes-pass-through"
                    />
                <Carousel.Caption>
                  <Text field={child.captionTitle.jss} />
                  <Text tag="p"  field={child.captionSubtitle.jss} />
                </Carousel.Caption>
              </Carousel.Item>
            ))}
        </Carousel>
      )
  );
};

export default MyCarousel;