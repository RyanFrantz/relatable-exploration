# Early Architecture Thinking

```mermaid
  graph LR
    FE((Frontend))-->GQL((GraphQL))-->λ1((Lambda 1))-->DDB(DynamoDB)
    GQL-->λ2((Lambda 2))-->DDB
    
```
