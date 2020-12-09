import React from "react";
import {Card} from "react-bootstrap";

const SearchResults = ({ data }) => {
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "15px"
        }}>
            {data.map(({ item }) => {
                const title = item.fields.find(f => f.name === "pageTitle")
                const shortDescription = item.fields.find(f => f.name === "ShortContent")
                return (
                    <Card style={{ width: '18rem' }} key={item.path}>
                        <Card.Body>
                            <Card.Title>{title.value}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{shortDescription.value}</Card.Subtitle>
                            <Card.Link href="#">Card Link</Card.Link>
                            <Card.Link href="#">Another Link</Card.Link>
                        </Card.Body>
                    </Card>
            )})}
        </>
    )
}

export default SearchResults;