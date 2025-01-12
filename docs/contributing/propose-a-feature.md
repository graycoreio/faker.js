# Propose a Feature

If you want to propose a new feature in Faker, please create a new issue using the [Feature Request Template](https://github.com/faker-js/faker/issues/new?labels=s%3A+pending+triage%2Cc%3A+feature%2Cs%3A+waiting+for+user+interest&projects=&template=feature_request.yml).

`@faker-js/faker` is all about enhancing the developer experience with realistic fake data.
As our library grows, we welcome contributions that introduce new features and maintain the cohesive functionality of our existing codebase.
To ensure quality and consistency, we have established guidelines for contributing new features.

## General Feature Guideline

General criteria for new features are as follows:

- **Relevance**: Must be widely applicable and not specific to a particular niche.
- **Deterministic**: Functions must be based on Fakers internal [Randomizer](/api/randomizer).
- **Conflict free**: Should not conflict with or duplicate existing features.
- **Utility**: Provides significant value to a broad user base.
- **Library agnostic**: Implementations must be based solely on JavaScript runtime environments and not on specific libraries or frameworks.

## Accepting a Feature

In order for a feature to be accepted in Faker, it must fulfill all the criteria listed in [General Feature Guideline](#general-feature-guideline).
Additionally, depending on the type of feature, there might be additional requirements.

::: tip Note
Using thumb-up emotes ( :+1: ) on issues gives the Faker team a general idea of the community interest in a feature.
If you see a feature request that you like, leave an up vote to increase interest.
You can obviously also upvote your own feature requests.
:::

### New Locale Criteria

Faker already contains [over 60 different locales](/guide/localization#available-locales).

If you want to propose a new locale that does not already exist, make sure to read our guide on [locale code names](/guide/localization#locale-codes).
You should be able to name your locale using the provided naming standards.
Ideally, you should also use this name in the issue's title and description.

## Considerations

Our goal is to maintain the library efficiently, ensuring that new features are indispensable.
Each addition to Faker comes with associated costs.
This encompasses initial expenses like design, implementation, review, and documentation of the feature.
Ideally, these tasks can be delegated to the requester or another member of the community.

Moreover, ongoing maintenance of Faker incurs further costs, including awareness of the feature, a more intricate module structure, increased bundle size, and additional effort during refactoring. 

If your feature isn't accepted into the library, you can still create it using Faker's Helper methods. 
Our goal is to empower developers, not limit possibilities.

For more details on creating custom features, refer to our documentation on [Create Complex Objects](/guide/usage#create-complex-objects).
