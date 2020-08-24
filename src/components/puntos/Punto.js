export class Punto {
    id
    user_id
    title
    slug
    content
    status
    price
    isNegotiable
    propertyType
    condition
    rating
    ratingCount
    contactNumber
    contactEmail
    link_id
    termsAndCondition
    image_id
    location_id
    tour_id
    created_at
    updated_at

    constructor(
    id = null,
    user_id = null,
    title = null,
    slug = null,
    content = null,
    status = null,
    price = null,
    isNegotiable = null,
    propertyType = null,
    condition = null,
    rating = null,
    ratingCount = null,
    contactNumber = null,
    contactEmail = null,
    link_id = null,
    termsAndCondition = null,
    image_id = null,
    location_id = null,
    tour_id = null,
    created_at = null,
    updated_at = null,
    ) {

        this.id = id
        this.user_id = user_id
        this.title = title
        this.slug = slug
        this.content = content
        this.status = status
        this.price = price
        this.isNegotiable = isNegotiable
        this.propertyType = propertyType
        this.condition = condition
        this.rating = rating
        this.ratingCount = ratingCount
        this.contactNumber = contactNumber
        this.contactEmail = contactEmail
        this.link_id = link_id
        this.termsAndCondition = termsAndCondition
        this.image_id = image_id
        this.location_id = location_id
        this.tour_id = tour_id
        this.created_at = created_at
        this.updated_at = updated_at
    }

    static fromSource(e){
        return new Punto(
            e.id,
            e.user_id,
            e.title,
            e.slug,
            e.content,
            e.status,
            e.price,
            e.isNegotiable,
            e.propertyType,
            e.condition,
            e.rating,
            e.ratingCount,
            e.contactNumber,
            e.contactEmail,
            e.link_id,
            e.termsAndCondition,
            e.image_id,
            e.location_id,
            e.tour_id,
            e.created_at,
            e.updated_at,
        )
    }
}