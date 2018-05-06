# Google Analytics.js Cookie Opt-in Consent Checker

Google Analytics cookies allow you, the webmaster, to link a particular user's page views together as a "unique visitor." When you add Google's analytics.js script to your site, you typically are creating the cookies automatically.

This script manages adding Google's analytics.js script to a simple website in a manner that requires evidence of user opt-in _before_ creating Google Analytics cookies. If it does not find an existing cookie indicating that the user previously opted-in to Google Analytics cookies through this script:

* It initializes Google Analytics _without_ creating a cookie.
* If the user has not already opted out, it displays an invitation to accept Google Analytics cookies, and records the user's choice in a new cookie named gaconsent which is then observed on subsequent page loads.

**_This script has a point of view, but it is not legal advice or opinion. Use of this script is strictly at your own risk._**

## A Page View is Recorded

The script still sends a page view to Google Analytics. What varies when the user has not opted-in to cookies is that multiple page views cannot be linked to unique visitor. The reason is that when analytics.js does not find existing GA cookies, a new and different clientId will associated with each page view. GA will treat each as a unique visitor, which will result in inflated unique visitor counts compared with historical data (whens users had to opt-out).

## A Consent Interaction Event is Recorded

If the user chooses Yes or No in the invitation, or if the user views the invitation without taking action, or if the invitation times out, an event will be sent to Google Analytics named GAConsent with one of those values (yes, no, viewed, timeout). An event also will be sent if the user triggers to revoke function. You can prevent recording of some or all of these events.

## Customizing the Script

The top part of the script lists parameters you must set for your Google Analytics account, and some you can modify for the appearance and features of the invitation. To see the default settings in action, you can visit this page: [Google Analytics Cookie Consent Demo](https://www.jeffersonscher.com/gaconsent/).

In many cases, your integration and styling needs will exceed what can be modified using those parameters. In that case, you can directly edit the script. Of course, you also can modify the invitation text to better fit your voice and your users' needs.

## Feedback

You can raise questions or provide comments using the "Issues" tab.
