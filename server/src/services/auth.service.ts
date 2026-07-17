import { User, IUserDocument } from '../models/User';
import { UserPreferences } from '../models/UserPreferences';
import { DashboardSettings } from '../models/DashboardSettings';
import { CareerProgress } from '../models/CareerProgress';
import { LearningProgress } from '../models/LearningProgress';
import { AiConversationHistory } from '../models/AiConversationHistory';
import { IRegisterInput, ILoginInput } from '../interfaces/auth.interface';

export class AuthService {
  /**
   * Registers a new user and initializes all 5 companion database documents.
   * Performs operations in a transactional style.
   */
  public static async registerUser(input: IRegisterInput): Promise<IUserDocument> {
    const { fullName, email, password } = input;

    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error: any = new Error('Email address is already registered.');
      error.statusCode = 409;
      throw error;
    }

    // Create the User document
    const user = new User({
      fullName,
      email,
      password, // Password hashing happens in the model pre-save hook
    });

    await user.save();

    try {
      // Initialize companion documents atomically using Promise.all
      await Promise.all([
        new UserPreferences({ userId: user._id }).save(),
        new DashboardSettings({ userId: user._id }).save(),
        new CareerProgress({ userId: user._id }).save(),
        new LearningProgress({ userId: user._id }).save(),
        new AiConversationHistory({ userId: user._id }).save(),
      ]);
    } catch (companionError) {
      // Rollback user creation on failure to keep DB clean
      await User.deleteOne({ _id: user._id });
      throw companionError;
    }

    return user;
  }

  /**
   * Authenticates a user with email and password.
   */
  public static async loginUser(input: ILoginInput): Promise<IUserDocument> {
    const { email, password } = input;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      const error: any = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    // Verify password using User model method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error: any = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    return user;
  }

  /**
   * Retrieves a user by their unique database ID.
   */
  public static async getUserById(id: string): Promise<IUserDocument | null> {
    return User.findById(id);
  }
}
