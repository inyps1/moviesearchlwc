import { LightningElement, wire } from 'lwc';
import { MessageContext,publish } from 'lightning/messageService';
import MOVIE_CHANNEL from '@salesforce/messageChannel/movieChannel__c';
const DELAY = 300;
export default class MovieSearch extends LightningElement {
    selectedType = '';
    loading = false;
    selectedSearch='';
    selectedPageNo = 1;
    delayTimeout;
    searchResult = [];
    selectedMovie = "";

    @wire(MessageContext)
    messageContext;

    get typeOptions() {
        return [
            { label: 'None', value: '' },
            { label: 'Movie', value: 'movie' },
            { label: 'Series', value: 'series' },
            { label: 'Episode', value: 'episode' },
        ];
    }

    handleChange(event) {
        this.loading = true;
        let {name, value} = event.target;
        if(name === "type"){
            this.selectedType = value;
        } else if(name == "search"){
            this.selectedSearch = value;
        } else if(name =="pageno"){
            this.selectedPageNo = value;
        }
        clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => {
            this.searchMovie();
        },DELAY)
       
    }

    async searchMovie(){
        const url = `https://www.omdbapi.com/?s=${this.selectedSearch}&type=${this.selectedType}&page=${this.selectedPageNo}&apikey=9605f26`;
        console.log('url: ',url);
        const res = await fetch(url);
        const data = await res.json();
        console.log('movie search url: ',data);
        this.loading = false;
        if(data.Response){
            this.searchResult = data.Search;
            console.log('movie search response: ',this.searchResult);
        }
    }

    get displaySearchResult(){
        return this.searchResult?.length > 0;
    }

    movieSelectedHandler(event){
        this.selectedMovie = event.detail;
        console.log('this.selectedMovie', this.selectedMovie);
        const payload = { movieId: this.selectedMovie };
        publish(this.messageContext, MOVIE_CHANNEL, payload);
    }
}