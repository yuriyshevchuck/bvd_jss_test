import React from "react";

const Facets = ({
        facets, 
        selectedFacets,
        getFacetNameById, 
        onSelectFacet
    }) => {
        const renderGroups = (_facets) => {
            let result = []
            for (const key in _facets) {
                result.push((
                    <>
                        <div style={{fontWeight: "bold"}}>{key}</div>
                        {_facets[key].map((facet) => {
                            const {value, count} = facet;
                            const isSelected = selectedFacets.find(el => el === value);
                            const selectedFacetStyles = {cursor: "pointer", color: "green"};
                            const facetStyles = {cursor: "pointer"};
                            return (
                                <div onClick={() => onSelectFacet(value)} key={value} style={isSelected ? selectedFacetStyles: facetStyles}>
                                    {getFacetNameById(value)}: {count} items {isSelected && '✓'}
                                </div>
                            )
                        })}
                    </>
                ))
            }
            return result;
        }
        return (
            <>
                <h2>Facets:</h2>
                <div>
                    {renderGroups(facets)}
                </div>
            </>
        )
}

export default Facets;