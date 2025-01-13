# Technical test

Technical test:

 

Make sure that you have +-16 hours available

You will build a solution on https://stackblitz.com/  with the latest angular version

1 time with rxjs & observables

1 time with signals & signalstore: https://ngrx.io/guide/signals/signal-store

That means we expect 2 separate stackblitz links

 

Tech test description:

 

See a video description here:

https://www.loom.com/share/91e9b2551c0540e4b14713f992bcfde7

 

Build this, in an online editor such as stackblitz: https://stackblitz.com/

 

Make sure that the project you deliver is something that you think will pass a professional review. It's not only about getting it to work. We're looking for somebody that produces quality code: simple, understandable, well structured.

 

There are 10 boxes

When you click a box, an option-selector with options comes into view

When you select one of the options, this option is shown in the selected box + automatically the next box becomes selected

If you click a box that has an option, it shows that option as selected in the option-selector

You have a button to remove all selections

If we refresh the screen, the selected options are still the same (so they are stored & loaded somewhere)

 

Don't think about design/css. Your design can be different.

Make sure that each box and each option are their own components (yes for this simple example that's overkill, but this exercise is about communication between components)

Make sure that your state lives in a service (not in the main component)

Make sure your state is accessed through observables (or in the second example, through signals). For communication between components, use as much as possible the services and as little as possible inputs & outputs.

So also the events like clicking the buttons should already become observables. This is a bit convoluted for this simple example but it's to see if you can work with more complex rxjs.

For the inputs that you do have in the signalstore implementation, make sure they are signal inputs.

 

Don't think about all the options, images and values that I have. Just make 10 or 20 options yourself, with for each of them a made-up value.

Use the latest angular version

Use standalone components

Use the new control flow (@for, @if, ...)

Make sure that each of your components uses onPush change detection

Build the solution 2 times:

1 time with rxjs & observables (communicate variables through services! Not through inputs & outputs!)

1 time with ngrx signalstore: https://ngrx.io/guide/signals/signal-store

 

Some extra points to pay attention to:

Separate the code into different angular component

Give meaningful variable & component names

Add comments to your code where it makes sense
