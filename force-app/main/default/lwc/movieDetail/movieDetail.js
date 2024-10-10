import { LightningElement, wire } from 'lwc';
import { MessageContext, subscribe, unsubscribe } from 'lightning/messageService';
import MOVIE_CHANNEL from '@salesforce/messageChannel/movieChannel__c';
export default class MovieDetail extends LightningElement {

    @wire(MessageContext)
    messageContext;
    loadComponent = false;
    subscription = null;
    movieDetails = {};
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                MOVIE_CHANNEL,
                (message) => this.handleMessage(message)
            );
        }
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    // Handler for message received by component
    handleMessage(message) {
        const movieId = message.movieId;
        console.log('----', movieId)
        this.fetchMovieDetail(movieId);
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    async fetchMovieDetail(movieId){
        const url = `https://www.omdbapi.com/?i=${movieId}&plot=full&apikey=9605f26`
        const res = await fetch(url);
        const data = await res.json();
        console.log('fetchMovieDetail: ',data);
        this.loadComponent = true
        this.movieDetails = data;
    }
}