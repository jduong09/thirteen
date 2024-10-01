import Game from '@/components/game/game';

describe('<Game />', () => {
  it('should render and display expected content', () => {
    // Mount the React component for the About page
    cy.mount(<Game />)
 
    // The new page should contain an h1 with "About page"
    cy.get('button').contains('Shuffle Deck');
  });
})