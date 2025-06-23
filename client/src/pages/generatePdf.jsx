import React, { useEffect } from "react";
import {
  Page,
  Text,
  Image,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Times-Roman",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});

const GeneratePdf = (props) => {
  useEffect(() => {
    console.log(props.data);
  }, []);
  return (
    <Document>
      {props && (
        <Page style={styles.body}>
          <Text style={styles.header}>{props.data && props.data.name}</Text>
          {/* <Image style={props.image} src={LebronStretch} /> */}
          <Text style={styles.text}>
            {props.data && props.data.name}
            {props.data && props.data.name}
            {props.data && props.data.name}
          </Text>
        </Page>
      )}
    </Document>
  );
};

export default GeneratePdf;
