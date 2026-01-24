import { ApolloClient, InMemoryCache, gql, HttpLink } from '@apollo/client/core/index.js';
import type { MeQuery } from './gql/types.ts';

export type Book = {
  title: string;
  pages: number;
  imageUrl: string;
  currentPage: number;
};

export type CurrentlyReadingData = {
  books: Book[];
};

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.hardcover.app/v1/graphql',
    headers: {
      authorization: process.env.HARDCOVER_TOKEN!,
    },
  }),
  cache: new InMemoryCache(),
});

const ME_QUERY = gql`
  query Me {
    me {
      id
      user_books(where: { status_id: { _eq: 2 } }) {
        id
        user_book_reads {
          progress_pages
        }
        book {
          id
          title
          pages
          image {
            url
          }
        }
      }
    }
  }
`;

export async function fetchCurrentlyReading(): Promise<CurrentlyReadingData> {
  try {
    const meResult = await client.query<MeQuery>({ query: ME_QUERY });
    const me = meResult.data?.me[0];

    if (!me) {
      throw new Error('Failed to fetch "me" from Hardcover');
    }

    const books: Book[] = me.user_books
      .map((userBook) => {
        const title = userBook.book.title;
        const imageUrl = userBook.book.image?.url;

        if (!title || !imageUrl) return null;

        return {
          title,
          pages: userBook.book.pages ?? 0,
          imageUrl,
          currentPage: userBook.user_book_reads[0]?.progress_pages ?? 0,
        };
      })
      .filter((book): book is Book => book !== null);

    return { books };
  } catch (error) {
    console.error('Failed to fetch "currently reading" from hardcover:', error);
    return { books: [] };
  }
}
