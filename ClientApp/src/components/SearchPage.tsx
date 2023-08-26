import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './SearchPage.css';

const bingSearch = new URL('https://api.bing.microsoft.com/v7.0/search');

type WebPage = {
    id: string;
    name: string;
    url: string;
    displayUrl: string;
    snippet: string;
    thumbnailUrl?: string;
};

type SearchResponse = {
  _type: "SearchResponse",
  queryContext?: {
    originalQuery?: string,
  }
  webPages?: {
    webSearchUrl: string,
    totalEstimatedMatches: number,
    value: WebPage[],
  },
  rankingResponse?: {
    mainline?: {
      items: {
        answerType: string,
        resultIndex?: number,
        value: { id: string },
      }[],
    },
  },
} | {
  _type: "ErrorResponse",
  errors: any[], // TODO(levirak): error type
};

async function getResults(search: string, pageIdx?: number): Promise<SearchResponse> {
  // TODO(levirak): this is super dangerous 
  const SUBSCRIPTION_KEY = process.env.REACT_APP_AZURE_SUBSCRIPTION_KEY;
  if (!SUBSCRIPTION_KEY) {
    throw new Error('AZURE_SUBSCRIPTION_KEY is not set.')
  }

  const pageSize = 10;

  const url = new URL(bingSearch);
  url.searchParams.append('q', search);
  url.searchParams.append('count', `${pageSize}`);
  if (pageIdx) {
    url.searchParams.append('offset', `${Math.floor(pageIdx) * pageSize}`);
  }

  console.log('FETCHING', url);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
    },
  });

  return await response.json() as unknown as SearchResponse;
}

function WebPageResult(props: { isDebug?: boolean, result: WebPage }) {
  const result = props.result;

  return (
    <div key={result.id} className='web-page-result'>
      <h4>
        {
          props.isDebug &&
            <button
              className='debug'
              type='button'
              onClick={() => console.log(result)}
            />
        }
        <a href={result.url}>{result.name}</a>
      </h4>
      <div className='link-text'>
        <a href={result.url}>{result.displayUrl}</a>
      </div>
      <div>
        {
          result.thumbnailUrl &&
            <img className='img-thumbnail' alt='thumbnail' src={result.thumbnailUrl} />
        }
        <p>{result.snippet}</p>
      </div>
    </div>
  );
}

export function SearchPage() {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const isDebug = Boolean(search.get('isDebug'));

  const [query, setQuery] = useState(isDebug? "cat": "");

  const [results, setResults] = useState<SearchResponse|null>(null);
  const [pageIdx, setPageIdx] = useState(0);
  const [fetchTime, setFetchTime] = useState(new Date());

  function handleSearch(newPageIdx: number) {
    getResults(query, newPageIdx)
      .then(result => {
        setResults(result);
        setPageIdx(newPageIdx);
        setFetchTime(new Date());
      });
  }

  return (
    <div id='search-page'>
      <h1>Search Page{isDebug && ' (Debug)'}</h1>
      <form id='search-box' onSubmit={event => {
        event.preventDefault();
        handleSearch(0);
      }}>
        {
          isDebug && results && <button
            className='debug'
            type='button'
            onClick={e => {
              e.preventDefault();
              console.log(results);
            }}
          />
        }
        <input
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <input
          type="submit"
          value="Search"
        />
      </form>
      {
        isDebug && <p>{fetchTime.toLocaleString()}</p>
      }
      {
        (results?._type === "SearchResponse") && <>
          {
            results.rankingResponse?.mainline?.items?.map(it => {
              switch (it.answerType) {
                case 'WebPages': {
                  const webPage = results.webPages?.value[it.resultIndex ?? 0];
                  return webPage &&
                    <WebPageResult
                      key={webPage.id}
                      isDebug={isDebug}
                      result={webPage}
                    />;
                }
                // TODO(levirak): handle the other types
                default:
                  if (isDebug) {
                    console.log(`not handling "${it.answerType}"`);
                  }
                  return null;
              }
            })
          }
          <div id='page-control'>
            <button className='back-button' disabled={pageIdx <= 0} type='button' onClick={() => handleSearch(pageIdx-1)}>
              Back
            </button>
            <div className='page-index'>
              page {pageIdx+1}
            </div>
            <button className='next-button'type='button' onClick={() => handleSearch(pageIdx+1)}>
              Next
            </button>
          </div>
        </>
      }
    </div>
  );
}
