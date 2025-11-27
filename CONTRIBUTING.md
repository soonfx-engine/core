# Contributing to SoonFx Engine

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them. Please make sure to read the relevant section before making your contribution. It will make it a lot easier for us maintainers and smooth out the experience for all involved. The community looks forward to your contributions.

> And if you like the project, but just don't have time to contribute, that's fine. There are other easy ways to support the project and show your appreciation, which we would also be very happy about:
> - Star the project
> - Tweet about it
> - Refer this project in your project's readme
> - Mention the project at local meetups and tell your friends/colleagues

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Project Structure](#project-structure)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Improving The Documentation](#improving-the-documentation)
- [Styleguides](#styleguides)
  - [Commit Messages](#commit-messages)

## Code of Conduct

This project and everyone participating in it is governed by the
[SoonFx Engine Code of Conduct](CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report unacceptable behavior
to <jiyisoon@163.com>.

## I Have a Question

> If you want to ask a question, we assume that you have read the available [Documentation](https://soonfx.dev).

Before you ask a question, it is best to search for existing [Issues](https://github.com/soonfx-engine/core/issues) that might help you. In case you have found a suitable issue and still need clarification, you can write your question in this issue. It is also advisable to search the internet for answers first.

## I Want To Contribute

### Reporting Bugs

#### Before Submitting a Bug Report

A good bug report shouldn't leave others needing to chase you up for more information. Therefore, we ask you to investigate carefully, collect information and describe the issue in detail in your report. Please complete the following steps in advance to help us fix any potential bug as fast as possible.

- Make sure that you are using the latest version.
- Determine if your bug is really a bug and not an error on your side e.g. using incompatible environment components/versions (Make sure that you have read the [documentation](https://soonfx.dev). If you are looking for support, you might want to check [this section](#i-have-a-question)).
- To see if other users have experienced (and potentially already solved) the same issue you are having, check if there is not already a bug report existing for your bug or error in the [bug tracker](https://github.com/soonfx-engine/core/issues?q=label%3Abug).
- Also make sure to search the internet (including Stack Overflow) to see if users outside of the GitHub community have discussed the issue.
- Collect information about the bug:
  - Stack trace (Traceback)
  - OS, Platform and Version (Windows, Linux, macOS, x86, ARM)
  - Version of the interpreter, compiler, SDK, runtime environment, package manager, depending on what seems relevant.
  - Possibly your input and the output
  - Can you reliably reproduce the issue? And can you also reproduce it with older versions?

#### How to Submit a Good Bug Report

We use GitHub issues to track bugs and errors. If you run into an issue with the project:

- Open an [Issue](https://github.com/soonfx-engine/core/issues/new). (Since we can't be sure whether it is a bug or not, we provide a general issue template for now).
- Explain the behavior you would expect and the actual behavior.
- Please provide as much context as possible and describe the *reproduction steps* that someone else can follow to recreate the issue on their own. This usually includes your code. For good bug reports you should isolate the problem and create a reduced test case.
- Provide the information you collected in the previous section.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for SoonFx Engine, **including completely new features and minor improvements to existing functionality**. Following these guidelines will help maintainers and the community to understand your suggestion and find related suggestions.

#### Before Submitting an Enhancement

- Make sure that you are using the latest version.
- Read the [documentation](https://soonfx.dev) carefully and find out if the functionality is already covered, maybe by an individual configuration.
- Perform a [search](https://github.com/soonfx-engine/core/issues) to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.
- Find out whether your idea fits with the scope and aims of the project. It's up to you to make a strong case to convince the project's developers of the merits of this feature. Keep in mind that we want features that will be useful to the majority of our users and not just a small subset. If you're just targeting a minority of users, consider writing an add-on/plugin library.

#### How to Submit a Good Enhancement Suggestion

Enhancement suggestions are tracked as [GitHub issues](https://github.com/soonfx-engine/core/issues).

- Use a **clear and descriptive title** for the issue to identify the suggestion.
- Provide a **step-by-step description of the suggested enhancement** in as many details as possible.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why. At this point you can also tell which alternatives do not work for you.
- You may want to include screenshots and animated GIFs which help you demonstrate the steps or point out the part which the suggestion is related to.
- Explain why this enhancement would be useful to most SoonFx Engine users. You may also want to point out the other projects that solved it better and which could serve as inspiration.

### Project Structure

To help you get started, here is an overview of the project structure:

- `src/core/`: Core engine logic (battle simulation, events, system).
- `src/data/`: Data models and metadata storage.
- `src/game/`: Game-specific implementations (formulas, combat logic).
- `src/communication/`: Messaging and event handling.
- `src/utils/`: Utility functions and helpers.
- `docs/`: Documentation files.
- `examples/`: Usage examples and demos.

### Your First Code Contribution

1.  Fork the project
2.  Clone your fork:
    ```bash
    git clone https://github.com/your-username/core.git
    cd core
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Create a new branch for your feature or fix:
    ```bash
    git checkout -b feature/amazing-feature
    ```
5.  Make your changes.
6.  Run tests to ensure everything is working:
    ```bash
    npm test
    ```
7.  Lint your code:
    ```bash
    npm run lint
    ```
8.  Build the project to check for build errors:
    ```bash
    npm run build
    ```
9.  Commit your changes (see [Commit Messages](#commit-messages)).
10. Push to your fork and open a Pull Request.

### Improving The Documentation

Documentation is located in the `docs/` folder and `README.md` files. You can submit PRs to improve clarity, fix typos, or add missing examples.

## Styleguides

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation

Example:
```
feat(parser): add support for custom function registration
```
