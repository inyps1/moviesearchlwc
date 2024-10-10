import { LightningElement, api } from 'lwc';

export default class MovieTile extends LightningElement {
    @api movie;
    @api selectedMovieId;
    clickHandler(event){
        console.log(this.movie.imdbID);
        const evt = new CustomEvent('selectedmovie',{
            detail: this.movie.imdbID
        })
        this.dispatchEvent(evt);
    }

    get tileSelected(){
        return this.movie.imdbID === this.selectedMovieId ? 'tile selected':'tile'
    }
}