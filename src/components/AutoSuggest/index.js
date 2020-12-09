import React, { useCallback, useState, useMemo } from "react";
import { useQuery } from '@apollo/react-hooks';
import { gql } from "apollo-boost";

import ProductSearchInput from "../ProductSearchInput";
import Facets from "../Facets";
import SearchResults from "../SearchResults";


const groupBy = (items, key) => items.reduce(
    (result, item) => ({
        ...result,
        [item[key]]: [
            ...(result[item[key]] || []),
            item,
        ],
    }),
    {},
);

// const 

const CUSTOM_SEARCH = gql`
query CustomSearch(
    $conditions: [CustomItemSearchFieldQuery]!
    $keyword: String!
){   
    customSearch(
        keyword: $keyword 
        rootItem: "{8E6CBF71-22C2-43EF-B21D-1DF7D45B583A}"
        conditions: $conditions
        facetOn:["Facets"]
    )
    {
      facets {
        name
        values {
          value
          count
        }
      }
      
      results
      {
        totalCount
        items
        {
          item
          {
            path
              fields(excludeStandardFields: true)
              {
                  name
                  value
              }
          }
        }
      }
    }
  }

`

const SEARCH_ITEMS = gql`
 query FacetsQuery($keyword: String!) {
    search(keyword:$keyword fieldsEqual:[
        {name:"_fullpath", value:"/sitecore/content/bvd_jss_test/home/products/*" },
        {name:"_templatename", value:"App Route" }
        
    ], facetOn:["Facets"])
    {
        facets {
        name
        values {
            value
            count
        }
        }
        
        results
        {
        totalCount
        items
        {
            item
            {
            path
            fields(excludeStandardFields: true)
            {
                name
                value
            }
            }
        }
        }
    }
    }
`

const GET_FACETS = gql`
  {
    item(path: "/sitecore/content/bvd_jss_test/Content/Facets")
    {
      name
      children
      {
        name
        children
        {
          id
          name
        }
      }
    }
  }
`

export default function AutoSuggest() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFacets, setSelectedFacets] = useState([]);

    const handleSelectFacet = useCallback((facetId) => {
        if(selectedFacets.find(el => el === facetId)) {
            setSelectedFacets(selFacets => selFacets.filter(f => f !== facetId));
        } else {
            setSelectedFacets(selFacets => [...selFacets, facetId])
        }
    }, [setSelectedFacets, selectedFacets])

    const facetsForGQL = useMemo(() => {
        return selectedFacets.map(facetId => ({
            name: "Facets",
            value: facetId,
            contains: true
        }))
    }, [selectedFacets])

    // console.log("selectedFacets: ", selectedFacets)

    // {name:"Facets", value:"c24dc1f870164ea69dae41c859892362", contains: true},
    // {name:"Facets", value:"05cdcff5de364a7a94cca87a3bb91143", contains: true}

    // const [searchResults, setSearchResults] = useState([1,2,3]);
    const { loading, error, data } = useQuery(
        SEARCH_ITEMS,
        {
            variables: {
                "keyword": searchTerm || "*"
            }
        }
    );

    const {
        loading: customSearchLoading,
        error: customSearchError,
        data: customSearchResult
    } = useQuery(
        CUSTOM_SEARCH,
        {
            variables: {
                conditions: [
                    {name:"_templatename", value:"App Route" },
                    {name:"_fullpath", value:"/sitecore/content/bvd_jss_test/home/products/", contains: true},
                    ...facetsForGQL
                ],
                keyword: searchTerm || "*"
            }
        }    
    )
    console.log("customSearchResult: ", customSearchResult)
    const { 
        loading: _facetsLoading, 
        error: _facetsError, 
        data: facetsData 
    } = useQuery(GET_FACETS);
    // console.log("facetsData: ", facetsData);
    //     if (facetsData) {
    //         facetsData.item.children.forEach(item => setFacets([...facets, ...(item.children)]));
    //         console.log("facetsData: ", facetsData)
    const allFacets = useMemo(() => {
        if (facetsData) {
            let facetsResult = []
            facetsData.item.children.forEach(item => {
                facetsResult = facetsResult.concat(item.children)
            });
            return facetsResult;
        }
    }, [facetsData]);

    const groupedFacets = useMemo(() => {
        if (customSearchResult && 
            customSearchResult.customSearch && 
            customSearchResult.customSearch.facets && 
            customSearchResult.customSearch.facets[0] && 
            facetsData
        ) {
            let _f = JSON.parse(JSON.stringify(customSearchResult.customSearch.facets[0].values));
            for (let group of facetsData.item.children) {
                console.log("group: ", group);
                for (let f of _f) {
                    if (group.children.find(el => el.id === f.value.toUpperCase())) {
                        f.group = group.name
                    }
                }
            }
            let res = []
            for (let g in groupBy(_f, "group")) {
                res = [...res, ...g]
            }
            // console.log("_f: ", _f)
            // console.log(`groupBy(_f, "group"): `, groupBy(_f, "group"))
            // console.log("res: ", res)
            // return res
            // _f = _f.map(singleFacet => )
            // return _f;
            return groupBy(_f, "group")

        } else {
            return []
        }
    }, [customSearchResult, facetsData])

    const getFacetNameById = useCallback((facetId) => {
        if (allFacets && facetId) {
            const facet = allFacets.find((f) => f.id === facetId.toUpperCase());
            if (facet) {
                return facet.name
            } else {
                return `unknown (id: ${facetId})`
            }
        } else {
            return facetId
        }
    }, [allFacets])
    
    const handleSearch = useCallback((e) => {
        setSearchTerm(e.target.value);
    }, [setSearchTerm])



    // console.log(loading, error, data);

    return (
        <div style={{ width: "40vw", margin: "1vh 30vw" }}>
            <ProductSearchInput 
                inputValue={searchTerm}
                onChange={handleSearch}
            />
            {customSearchLoading ? (<div>Loading...</div>) :
                (<div>
                    {/* <h2>Facets:</h2>
                    <div>
                        {groupedFacets.map((v) => {
                            return (<div>
                                {getFacetName(v.value)}: {v.count} items
                            </div>)
                        })}
                    </div> */}
                    <div style={{left: "20vw", top: "63px", position: "absolute"}}>
                        <Facets 
                            facets={groupedFacets}
                            selectedFacets={selectedFacets}
                            getFacetNameById={getFacetNameById}
                            onSelectFacet={handleSelectFacet}
                        />
                        <h4> Total: {customSearchResult.customSearch.results.totalCount}</h4>
                    </div>

                    <div>
                        <h2>Items:</h2>
                        <SearchResults
                            data={customSearchResult.customSearch.results.items}
                        />
                    </div>
                </div>)}
        </div>
    )
}