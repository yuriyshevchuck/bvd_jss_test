import React from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap"

const ProductSearchInput = ({ inputValue, onChange }) => {
    return (<div>
        <InputGroup className="mb-3">
            <FormControl
                placeholder="Type a product's name"
                aria-label="Type a product's name"
                aria-describedby="basic-addon2"
                value={inputValue}
                onChange={onChange}
            />
            <InputGroup.Append>
                <Button variant="outline-secondary">Search</Button>
            </InputGroup.Append>
        </InputGroup>
    </div>)
}

export default ProductSearchInput;