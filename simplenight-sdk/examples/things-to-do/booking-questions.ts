import * as apiTypes from '@/api/core'
import { ArrayElement } from '@/utils/typescript'

type BookingQuestion = ArrayElement<ArrayElement<apiTypes.ThingsDetailsResponse['variants']>['attributes']['booking_questions']>
type CartBookingQuestion = ArrayElement<Extract<apiTypes.CartItemsCreateRequestDto['booking_data'], {category: 'things'}>['booking_questions']>

export type TravelerInfo = {
  [key: string]: any;
};

export type BookingInfo = {
  [key: string]: any;
};

export function fillBookingQuestions(questions: BookingQuestion[], travelers: TravelerInfo[], booking: BookingInfo) {
  const filledQuestions: Array<CartBookingQuestion> = []

  questions.forEach(question => {
    if (question.group === 'PER_TRAVELER') {
      travelers.forEach((traveler, index) => {
        const travelerValue = traveler[question.id]
        if (travelerValue !== undefined) {
          let answer
          if (question.type === 'STRING' && typeof travelerValue === 'string') {
            answer = travelerValue.substring(0, question.maxLength)
          } else if (question.type === 'NUMBER_AND_UNIT' && typeof travelerValue === 'number' && question.units) {
            answer = { value: travelerValue, unit: question.units[0] } // Example: choosing the first unit
          } else if (question.type === 'DATE' && travelerValue instanceof Date) {
            answer = travelerValue.toISOString().split('T')[0]
          } else if (question.type === 'TIME' && typeof travelerValue === 'string') {
            answer = travelerValue // Assuming time is in correct string format
          } else if (question.type === 'LOCATION_REF_OR_FREE_TEXT' && typeof travelerValue === 'string') {
            answer = travelerValue.substring(0, question.maxLength)
          }

          filledQuestions.push({
            question: question.id,
            answer,
            travelerNum: index + 1,
          })
        }
      })
    } else if (question.group === 'PER_BOOKING') {
      const bookingValue = booking[question.id]
      if (bookingValue !== undefined) {
        let answer
        if (question.type === 'STRING' && typeof bookingValue === 'string') {
          answer = bookingValue.substring(0, question.maxLength)
        } else if (question.type === 'NUMBER_AND_UNIT' && typeof bookingValue === 'number' && question.units) {
          answer = { value: bookingValue, unit: question.units[0] } // Example: choosing the first unit
        } else if (question.type === 'DATE' && bookingValue instanceof Date) {
          answer = bookingValue.toISOString().split('T')[0]
        } else if (question.type === 'TIME' && typeof bookingValue === 'string') {
          answer = bookingValue // Assuming time is in correct string format
        } else if (question.type === 'LOCATION_REF_OR_FREE_TEXT' && typeof bookingValue === 'string') {
          answer = bookingValue.substring(0, question.maxLength)
        }

        filledQuestions.push({
          question: question.id,
          answer,
        })
      }
    }
  })

  return filledQuestions
}

// Example usage:
const bookingQuestions: BookingQuestion[] = [
  {
    id: 'FULL_NAMES_FIRST',
    legacyBookingQuestionId: 24,
    group: 'PER_TRAVELER',
    type: 'STRING',
    required: 'MANDATORY',
    label: 'First name',
    maxLength: 50,
  },
  {
    id: 'FULL_NAMES_LAST',
    legacyBookingQuestionId: 25,
    group: 'PER_TRAVELER',
    type: 'STRING',
    required: 'MANDATORY',
    label: 'Last name',
    maxLength: 50,
  },
  {
    id: 'SPECIAL_REQUIREMENTS',
    legacyBookingQuestionId: 27,
    group: 'PER_BOOKING',
    type: 'STRING',
    required: 'OPTIONAL',
    label: 'Special requirements',
    maxLength: 1000,
  },
  {
    id: 'AGEBAND',
    legacyBookingQuestionId: 30,
    group: 'PER_TRAVELER',
    type: 'STRING',
    required: 'MANDATORY',
    label: 'Age band',
    maxLength: 50,
    allowedAnswers: [
      'ADULT',
      'SENIOR',
      'YOUTH',
      'CHILD',
      'INFANT',
      'TRAVELER',
    ],
  },
  {
    id: 'LANGUAGE_GUIDE',
    group: 'PER_BOOKING',
    type: 'STRING',
    required: 'MANDATORY',
    label: 'Language Guide',
    allowedAnswers: [
      'en',
    ],
  },
]

// const travelers: TravelerInfo[] = [
//     { FULL_NAMES_FIRST: "John", FULL_NAMES_LAST: "Doe", AGEBAND: "ADULT" },
//     { FULL_NAMES_FIRST: "Jane", FULL_NAMES_LAST: "Doe", AGEBAND: "YOUTH" }
// ];
//
// const booking: BookingInfo = {
//     SPECIAL_REQUIREMENTS: "Vegetarian meal",
//     LANGUAGE_GUIDE: "en"
// };
//
// const filledBookingQuestions = fillBookingQuestions(bookingQuestions, travelers, booking);
// console.log(filledBookingQuestions);
